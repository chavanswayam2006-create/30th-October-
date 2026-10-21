import React from 'react';
import {
  Star,
  Heart,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  Lock,
  Unlock,
  Map,
  Compass,
  Music,
  Disc,
  Headphones,
  ListMusic,
  User,
  Film,
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Sparkles,
  RotateCcw,
  Trophy,
  Brain,
  PartyPopper,
  ShoppingBag,
  Mail,
  Moon,
  Leaf,
  Smile,
  Coffee,
  Cake,
  Ticket,
  Camera,
  Droplet,
  CheckCircle2,
  Wand2,
  PenLine,
  FileText,
  Clock,
  Key,
  Award
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 20, style }) => {
  const norm = name.toLowerCase().replace(/[-_]/g, '');

  switch (norm) {
    case 'star':
    case 'stars':
      return <Star size={size} className={className} style={style} />;
    case 'favorite':
    case 'heart':
      return <Heart size={size} className={className} style={style} />;
    case 'chevronright':
      return <ChevronRight size={size} className={className} style={style} />;
    case 'chevronleft':
      return <ChevronLeft size={size} className={className} style={style} />;
    case 'arrowforward':
    case 'arrowright':
      return <ArrowRight size={size} className={className} style={style} />;
    case 'arrowdownward':
    case 'arrowdown':
      return <ArrowDown size={size} className={className} style={style} />;
    case 'arrowback':
    case 'arrowleft':
      return <ArrowLeft size={size} className={className} style={style} />;
    case 'lock':
      return <Lock size={size} className={className} style={style} />;
    case 'lockopen':
      return <Unlock size={size} className={className} style={style} />;
    case 'map':
      return <Map size={size} className={className} style={style} />;
    case 'explore':
    case 'compass':
      return <Compass size={size} className={className} style={style} />;
    case 'musicnote':
    case 'music':
      return <Music size={size} className={className} style={style} />;
    case 'album':
    case 'vinyl':
      return <Disc size={size} className={className} style={style} />;
    case 'headphones':
      return <Headphones size={size} className={className} style={style} />;
    case 'queuemusic':
    case 'playlist':
      return <ListMusic size={size} className={className} style={style} />;
    case 'person':
    case 'user':
      return <User size={size} className={className} style={style} />;
    case 'movie':
    case 'film':
      return <Film size={size} className={className} style={style} />;
    case 'play':
    case 'playarrow':
    case 'playcircle':
      return <Play size={size} className={className} style={style} />;
    case 'pause':
      return <Pause size={size} className={className} style={style} />;
    case 'fullscreen':
      return <Maximize2 size={size} className={className} style={style} />;
    case 'volumeup':
      return <Volume2 size={size} className={className} style={style} />;
    case 'volumeoff':
      return <VolumeX size={size} className={className} style={style} />;
    case 'notificationsactive':
      return <Bell size={size} className={className} style={style} />;
    case 'notificationsoff':
      return <BellOff size={size} className={className} style={style} />;
    case 'autoawesome':
    case 'sparkles':
    case 'style':
      return <Sparkles size={size} className={className} style={style} />;
    case 'replay':
    case 'refresh':
      return <RotateCcw size={size} className={className} style={style} />;
    case 'trophy':
      return <Trophy size={size} className={className} style={style} />;
    case 'psychologyalt':
    case 'quiz':
      return <Brain size={size} className={className} style={style} />;
    case 'celebration':
      return <PartyPopper size={size} className={className} style={style} />;
    case 'shoppingbasket':
      return <ShoppingBag size={size} className={className} style={style} />;
    case 'mail':
      return <Mail size={size} className={className} style={style} />;
    case 'nightsstay':
    case 'bedtime':
    case 'moon':
      return <Moon size={size} className={className} style={style} />;
    case 'spa':
    case 'leaf':
      return <Leaf size={size} className={className} style={style} />;
    case 'mood':
    case 'smile':
      return <Smile size={size} className={className} style={style} />;
    case 'localcafe':
    case 'coffee':
      return <Coffee size={size} className={className} style={style} />;
    case 'bakerydining':
    case 'cake':
      return <Cake size={size} className={className} style={style} />;
    case 'airplaneticket':
    case 'ticket':
      return <Ticket size={size} className={className} style={style} />;
    case 'photocamera':
    case 'camera':
      return <Camera size={size} className={className} style={style} />;
    case 'waterdrop':
      return <Droplet size={size} className={className} style={style} />;
    case 'checkcircle':
      return <CheckCircle2 size={size} className={className} style={style} />;
    case 'magicbutton':
      return <Wand2 size={size} className={className} style={style} />;
    case 'draw':
    case 'stylusnote':
      return <PenLine size={size} className={className} style={style} />;
    case 'stickynote2':
      return <FileText size={size} className={className} style={style} />;
    case 'hourglass':
    case 'hourglasstop':
    case 'schedule':
      return <Clock size={size} className={className} style={style} />;
    case 'key':
      return <Key size={size} className={className} style={style} />;
    case 'militarytech':
    case 'award':
      return <Award size={size} className={className} style={style} />;
    case 'equalizer':
      return <Sparkles size={size} className={className} style={style} />;
    default:
      return <Sparkles size={size} className={className} style={style} />;
  }
};
