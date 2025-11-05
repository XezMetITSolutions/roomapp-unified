# RoomApp - Hotel Management System

A comprehensive hotel management system with QR-based guest services, multi-language support, and real-time communication between reception, kitchen, and guests.

## 🏨 Features

### Guest Interface (QR Code Access)
- **Multi-language Support**: 9 languages including Turkish, English, German, French, Spanish, Italian, Russian, Arabic, and Chinese
- **Hotel Information**: WiFi passwords, check-out times, meal schedules, hotel rules, and emergency contacts
- **Room Service Ordering**: Browse menu, add to cart, place orders with special instructions
- **Quick Requests**: One-click requests for towels, cleaning, maintenance, and concierge services
- **Real-time Updates**: Instant notifications to reception and kitchen staff

### Reception Panel
- **Request Management**: View and manage all guest requests with priority levels
- **Notification System**: Real-time alerts for new requests and orders
- **Guest Information**: Access guest details and room status
- **Status Tracking**: Update request status from pending to completed

### Kitchen Panel
- **Order Management**: View and process room service orders
- **Menu Management**: Update item availability and pricing
- **Preparation Tracking**: Estimated cooking times and order status updates
- **Special Instructions**: Handle dietary requirements and special requests

### Admin Features
- **QR Code Generator**: Generate unique QR codes for each room
- **Room Management**: Track room status, guest information, and occupancy
- **Analytics Dashboard**: Monitor hotel performance and guest satisfaction
- **Staff Management**: Manage hotel staff roles and shifts

## 🚀 Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom hotel theme
- **State Management**: Zustand for global state
- **QR Codes**: qrcode.react for QR code generation
- **Icons**: Lucide React for consistent iconography
- **Internationalization**: Custom translation system with 9 languages

## 📱 How It Works

1. **QR Code System**: Each hotel room has a unique QR code
2. **Guest Access**: Guests scan QR codes to access room-specific interface
3. **Multi-language**: AI-powered language selection for international guests
4. **Request Flow**: Guests make requests → Reception receives notifications → Staff processes
5. **Room Service**: Guests order food → Kitchen receives orders → Staff prepares and delivers

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd roomApp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📋 Usage

### For Hotel Staff

1. **Main Dashboard**: Access all panels from the homepage
2. **Reception Panel**: Monitor and respond to guest requests
3. **Kitchen Panel**: Manage room service orders and menu items
4. **QR Generator**: Create and print QR codes for rooms

### For Guests

1. **Scan QR Code**: Use phone camera to scan room QR code
2. **Select Language**: Choose preferred language from 9 options
3. **Access Services**: 
   - View hotel information and WiFi password
   - Order room service from the menu
   - Request housekeeping, maintenance, or concierge services

## 🏗️ Project Structure

```
roomApp/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── admin/             # Admin panels
│   │   ├── guest/             # Guest interface
│   │   ├── kitchen/           # Kitchen management
│   │   ├── reception/         # Reception panel
│   │   └── page.tsx           # Main dashboard
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities and helpers
│   │   ├── qrGenerator.ts     # QR code generation
│   │   ├── translations.ts    # Multi-language support
│   │   └── sampleData.ts      # Demo data
│   ├── store/                 # Zustand state management
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── package.json              # Dependencies and scripts
```

## 🎨 Design System

### Colors
- **Hotel Navy**: Primary brand color (#1e3a8a)
- **Hotel Gold**: Accent color (#D4AF37)
- **Hotel Cream**: Background color (#fefce8)
- **Hotel Sage**: Success color (#84cc16)

### Components
- **Hotel Cards**: Consistent card design with shadows and hover effects
- **Hotel Buttons**: Primary and secondary button styles
- **Notification Badges**: Real-time notification indicators

## 🌐 Multi-Language Support

The system supports 9 languages with comprehensive translations:

- 🇹🇷 Turkish (Türkçe)
- 🇺🇸 English
- 🇩🇪 German (Deutsch)
- 🇫🇷 French (Français)
- 🇪🇸 Spanish (Español)
- 🇮🇹 Italian (Italiano)
- 🇷🇺 Russian (Русский)
- 🇸🇦 Arabic (العربية)
- 🇨🇳 Chinese (中文)

## 📊 Sample Data

The system comes with pre-loaded sample data:
- 5 hotel rooms with different types and statuses
- 4 sample guests with different languages
- 18 menu items across 5 categories
- 5 staff members with different roles

## 🔧 Configuration

### Hotel Information
Update hotel details in `src/store/hotelStore.ts`:
- Hotel name and contact information
- WiFi password and network details
- Check-in/check-out times
- Meal service hours
- Facility hours (pool, gym, spa)
- Hotel rules and emergency contacts

### Menu Management
Menu items can be managed through:
- Kitchen panel interface
- Direct store updates in `src/lib/sampleData.ts`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Export Static Files
```bash
npm run export
```

### Deploy to Netlify
```bash
npm run deploy
```

## 🔒 Security Features

- **QR Code Validation**: Time-based QR code validation (24-hour expiry)
- **Room-specific Access**: Each QR code is tied to a specific room
- **Data Validation**: Input validation and sanitization
- **Secure State Management**: Centralized state with proper data flow

## 📱 Mobile Optimization

- **Responsive Design**: Optimized for all device sizes
- **Touch-friendly Interface**: Large buttons and easy navigation
- **QR Code Scanning**: Optimized for mobile camera scanning
- **Offline Capability**: Core features work without internet

## 🎯 Key Benefits

### For Hotels
- **Reduced Staff Workload**: Automated request routing
- **Improved Guest Satisfaction**: Faster response times
- **Better Communication**: Real-time notifications
- **Cost Savings**: Reduced phone calls and manual processes

### For Guests
- **Contactless Service**: No need to call reception
- **Multi-language Support**: Service in native language
- **24/7 Access**: Request services anytime
- **Transparent Process**: Track request status

## 🔄 Future Enhancements

- **Payment Integration**: Stripe/PayPal for room service payments
- **Push Notifications**: Real-time mobile notifications
- **Analytics Dashboard**: Detailed reporting and insights
- **Integration APIs**: Connect with existing hotel management systems
- **Voice Commands**: Voice-activated requests
- **AI Chatbot**: Automated guest assistance

## 📞 Support

For technical support or feature requests, please contact the development team.

## 📄 License

This project is proprietary software developed for hotel management purposes.

---

**RoomApp** - Streamlining hotel operations with modern technology 🏨✨
