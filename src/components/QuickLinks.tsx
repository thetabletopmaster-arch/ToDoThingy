import { useState, useEffect } from 'react';
import { ExternalLink, Plus, Trash2, Mail, MessageCircle, BookOpen, Bot, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickLink {
  id: string;
  name: string;
  url: string;
  color?: string;
  icon?: string;
}

const defaultLinks: QuickLink[] = [
  { id: '1', name: 'Claude', url: 'https://claude.ai', color: '#d4af37', icon: 'Bot' },
  { id: '2', name: 'ChatGPT', url: 'https://chat.openai.com', color: '#10a37f', icon: 'Bot' },
  { id: '3', name: 'Skool', url: 'https://www.skool.com', color: '#ff6b35', icon: 'BookOpen' },
  { id: '4', name: 'Gmail', url: 'https://mail.google.com', color: '#ea4335', icon: 'Mail' },
  { id: '5', name: 'WhatsApp', url: 'https://web.whatsapp.com', color: '#25d366', icon: 'MessageCircle' },
];

const iconOptions = [
  { name: 'Bot', component: Bot },
  { name: 'Mail', component: Mail },
  { name: 'MessageCircle', component: MessageCircle },
  { name: 'BookOpen', component: BookOpen },
  { name: 'ExternalLink', component: ExternalLink },
];

const getIconComponent = (iconName?: string) => {
  const icon = iconOptions.find(i => i.name === iconName);
  return icon ? icon.component : ExternalLink;
};

const LINKS_KEY = 'productivity-dashboard-quick-links';

export default function QuickLinks({ isMidnight: _isMidnight }: { isMidnight: boolean }) {
  const [links, setLinks] = useState<QuickLink[]>(() => {
    const stored = localStorage.getItem(LINKS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultLinks;
      }
    }
    return defaultLinks;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkColor, setNewLinkColor] = useState('#d4af37');
  const [newLinkIcon, setNewLinkIcon] = useState('ExternalLink');

  useEffect(() => {
    localStorage.setItem(LINKS_KEY, JSON.stringify(links));
  }, [links]);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLinkName.trim() && newLinkUrl.trim()) {
      const newLink: QuickLink = {
        id: Date.now().toString(),
        name: newLinkName.trim(),
        url: newLinkUrl.trim(),
        color: newLinkColor,
        icon: newLinkIcon,
      };
      setLinks([...links, newLink]);
      setNewLinkName('');
      setNewLinkUrl('');
      setNewLinkColor('#d4af37');
      setNewLinkIcon('ExternalLink');
    }
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-[#d4af37]">Quick Links</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs px-2 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/30 transition-colors"
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
        {links.map((link, index) => {
          const IconComponent = getIconComponent(link.icon);
          return (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-md block text-white"
                style={{
                  backgroundColor: link.color || '#d4af37',
                  filter: 'brightness(1)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
              >
                <span>{link.name}</span>
                <IconComponent className="w-3 h-3" />
              </a>
              {isEditing && (
                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddLink}
            className="glass-effect rounded-lg p-3 space-y-2"
          >
            <input
              type="text"
              value={newLinkName}
              onChange={(e) => setNewLinkName(e.target.value)}
              placeholder="Link name (e.g., YouTube)"
              className="w-full px-3 py-2 rounded-lg border-2 border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37] bg-black/40 text-[#ddc3a5] placeholder-amber-500/30 text-sm"
            />
            <input
              type="url"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              placeholder="URL (e.g., https://youtube.com)"
              className="w-full px-3 py-2 rounded-lg border-2 border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37] bg-black/40 text-[#ddc3a5] placeholder-amber-500/30 text-sm"
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-[#d4af37] mb-1 block">Color</label>
                <input
                  type="color"
                  value={newLinkColor}
                  onChange={(e) => setNewLinkColor(e.target.value)}
                  className="w-full h-10 rounded-lg border-2 border-[#d4af37]/40 bg-black/40 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-[#d4af37] mb-1 block">Icon</label>
                <select
                  value={newLinkIcon}
                  onChange={(e) => setNewLinkIcon(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[#d4af37]/40 focus:outline-none focus:border-[#d4af37] bg-black/40 text-[#ddc3a5] text-sm"
                >
                  {iconOptions.map(icon => (
                    <option key={icon.name} value={icon.name}>{icon.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-3 py-2 rounded-lg bg-[#d4af37] text-[#1a120d] font-medium flex items-center justify-center gap-2 hover:bg-[#cd7f32] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
