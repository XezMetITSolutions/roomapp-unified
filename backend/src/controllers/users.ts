import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function getUsers(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId
    const hotelId = req.user?.hotelId

    if (!tenantId || !hotelId) {
      res.status(400).json({ 
        message: 'Tenant veya hotel bilgisi bulunamadı' 
      })
      return
    }

    const users = await prisma.user.findMany({
      where: {
        tenantId,
        hotelId
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        permissions: {
          select: {
            pageName: true
          }
        }
      }
    })

    const usersWithPermissions = users.map((user: any) => ({
      ...user,
      permissions: user.permissions.map((p: any) => p.pageName)
    }))

    res.json(usersWithPermissions)
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName, role, permissions } = req.body
    const tenantId = req.user?.tenantId
    const hotelId = req.user?.hotelId

    if (!tenantId || !hotelId) {
      res.status(400).json({ 
        message: 'Tenant veya hotel bilgisi bulunamadı' 
      })
      return
    }

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ 
        message: 'Email, şifre, ad ve soyad gerekli' 
      })
      return
    }

    // Email'in benzersiz olduğunu kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      res.status(400).json({ 
        message: 'Bu email adresi zaten kullanılıyor' 
      })
      return
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10)

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'STAFF',
        tenantId,
        hotelId,
        permissions: {
          create: (permissions || ['dashboard']).map((pageName: string) => ({
            pageName
          }))
        }
      },
      include: {
        permissions: true
      }
    })

    // Şifreyi response'dan çıkar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userResponse } = user
    const userWithPermissions = {
      ...userResponse,
      permissions: userResponse.permissions.map((p: any) => p.pageName)
    }

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: userWithPermissions
    })
  } catch (error) {
    console.error('Create user error:', error)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { email, firstName, lastName, role, isActive } = req.body
    const tenantId = req.user?.tenantId
    const hotelId = req.user?.hotelId

    if (!tenantId || !hotelId) {
      res.status(400).json({ 
        message: 'Tenant veya hotel bilgisi bulunamadı' 
      })
      return
    }

    // Kullanıcının var olduğunu ve yetkili olduğunu kontrol et
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        tenantId,
        hotelId
      }
    })

    if (!existingUser) {
      res.status(404).json({ 
        message: 'Kullanıcı bulunamadı' 
      })
      return
    }

    // Email benzersizliğini kontrol et (kendi email'i hariç)
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      })

      if (emailExists) {
        res.status(400).json({ 
          message: 'Bu email adresi zaten kullanılıyor' 
        })
        return
      }
    }

    // Kullanıcıyı güncelle
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(email && { email }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(role && { role }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        permissions: true
      }
    })

    // Şifreyi response'dan çıkar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userResponse } = updatedUser
    const userWithPermissions = {
      ...userResponse,
      permissions: userResponse.permissions.map((p: any) => p.pageName)
    }

    res.json({
      message: 'Kullanıcı başarıyla güncellendi',
      user: userWithPermissions
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export async function updateUserPermissions(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { permissions } = req.body
    const tenantId = req.user?.tenantId
    const hotelId = req.user?.hotelId

    if (!tenantId || !hotelId) {
      res.status(400).json({ 
        message: 'Tenant veya hotel bilgisi bulunamadı' 
      })
      return
    }

    if (!id) {
      res.status(400).json({ 
        message: 'Kullanıcı ID bulunamadı' 
      })
      return
    }

    if (!Array.isArray(permissions)) {
      res.status(400).json({ 
        message: 'Permissions array olmalı' 
      })
      return
    }

    // Kullanıcının var olduğunu kontrol et
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        tenantId,
        hotelId
      }
    })

    if (!existingUser) {
      res.status(404).json({ 
        message: 'Kullanıcı bulunamadı' 
      })
      return
    }

    // Mevcut izinleri sil
    await prisma.userPermission.deleteMany({
      where: { userId: id }
    })

    // Yeni izinleri ekle
    if (permissions.length > 0) {
      await prisma.userPermission.createMany({
        data: permissions.map((pageName: string) => ({
          userId: id,
          pageName
        }))
      })
    }

    // Güncellenmiş kullanıcıyı döndür
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      include: {
        permissions: true
      }
    })

    if (!updatedUser) {
      res.status(404).json({ 
        message: 'Kullanıcı bulunamadı' 
      })
      return
    }

    // Şifreyi response'dan çıkar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userResponse } = updatedUser
    const userWithPermissions = {
      ...userResponse,
      permissions: userResponse.permissions.map((p: any) => p.pageName)
    }

    res.json({
      message: 'Kullanıcı yetkileri başarıyla güncellendi',
      user: userWithPermissions
    })
  } catch (error) {
    console.error('Update user permissions error:', error)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params
    const tenantId = req.user?.tenantId
    const hotelId = req.user?.hotelId

    if (!tenantId || !hotelId) {
      res.status(400).json({ 
        message: 'Tenant veya hotel bilgisi bulunamadı' 
      })
      return
    }

    // Kendini silmeye çalışıyor mu kontrol et
    if (id === req.user?.id) {
      res.status(400).json({ 
        message: 'Kendi hesabınızı silemezsiniz' 
      })
      return
    }

    // Kullanıcının var olduğunu kontrol et
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        tenantId,
        hotelId
      }
    })

    if (!existingUser) {
      res.status(404).json({ 
        message: 'Kullanıcı bulunamadı' 
      })
      return
    }

    // Kullanıcıyı sil (permissions cascade ile silinecek)
    await prisma.user.delete({
      where: { id }
    })

    res.json({
      message: 'Kullanıcı başarıyla silindi'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
}
