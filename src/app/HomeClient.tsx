'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hotel, QrCode, Settings, CheckCircle, Star, Play, Shield, Globe, Smartphone, CreditCard, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Language } from '@/types';
import { translate } from '@/lib/translations';

export default function HomeClient() {