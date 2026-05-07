import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import useFooterSettings from '../hooks/useFooterSettings';

const logoWhite = new URL('../public/asset/Logo somacan White.png', import.meta.url).href;

export default function Footer() {
  const { footer, loading } = useFooterSettings();

  if (loading) return null;

  return (
    <footer className="py-24" style={{ backgroundColor: footer.theme.backgroundColor }}>
      <div className="section-padding">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4">
              <img
                src={footer.logo.src || logoWhite}
                alt={footer.logo.alt || 'Somacan'}
                className="w-[13rem] h-auto"
              />
            </div>
            <p className="leading-relaxed max-w-md mb-6" style={{ color: footer.theme.textColor }}>
              {footer.description}
            </p>
            <div className="flex gap-4">
              {footer.socials.map(social => (
                <a
                  key={social.platform}
                  href={social.href}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:text-white transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.10)',
                    color: footer.theme.accentColor,
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = footer.theme.accentColor}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)'}
                >
                  <span className="text-xs font-medium">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {footer.columns.map((column, idx) => (
            <div key={idx}>
              <h4 className="font-medium mb-6" style={{ color: footer.theme.headingColor }}>
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="transition-colors"
                        style={{ color: footer.theme.textColor }}
                        onMouseEnter={e => e.currentTarget.style.color = footer.theme.accentColor}
                        onMouseLeave={e => e.currentTarget.style.color = footer.theme.textColor}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="transition-colors"
                        style={{ color: footer.theme.textColor }}
                        onMouseEnter={e => e.currentTarget.style.color = footer.theme.accentColor}
                        onMouseLeave={e => e.currentTarget.style.color = footer.theme.textColor}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-medium mb-6" style={{ color: footer.theme.headingColor }}>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4" style={{ color: footer.theme.accentColor }} />
                <span style={{ color: footer.theme.textColor }}>{footer.contact.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4" style={{ color: footer.theme.accentColor }} />
                <span style={{ color: footer.theme.textColor }}>{footer.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4" style={{ color: footer.theme.accentColor }} />
                <span style={{ color: footer.theme.textColor }}>{footer.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ borderTop: `1px solid ${footer.theme.borderColor}` }}>
          <p style={{ color: footer.theme.textColor }}>{footer.legal.copyright}</p>
          <div className="flex gap-6">
            {footer.legal.links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                style={{ color: footer.theme.textColor }}
                onMouseEnter={e => e.currentTarget.style.color = footer.theme.accentColor}
                onMouseLeave={e => e.currentTarget.style.color = footer.theme.textColor}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
