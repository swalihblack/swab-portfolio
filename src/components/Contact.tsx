import { useState, type FormEvent } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const { ref, isVisible } = useScrollReveal();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    // Frontend-only: simulate submission
    setTimeout(() => {
      setSending(false);
      toast.success('Message sent! I\'ll get back to you soon.');
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-background">
      <div ref={ref} className="container max-w-xl">
        <h2
          className={`font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4 ${
            isVisible ? 'animate-fade-up' : 'opacity-0'
          }`}
        >
          Get in Touch
        </h2>

        <div className={`w-12 h-0.5 bg-accent mx-auto mb-6 ${isVisible ? 'animate-fade-up [animation-delay:100ms]' : 'opacity-0'}`} />

        <p
          className={`font-body text-center text-muted-foreground text-sm mb-4 ${
            isVisible ? 'animate-fade-up [animation-delay:150ms]' : 'opacity-0'
          }`}
        >
          Have a project in mind? Let's talk.
        </p>

        <a
          href="mailto:hello@swab.design"
          className={`flex items-center justify-center gap-2 font-body text-accent hover:text-accent/80 text-sm mb-10 transition-colors ${
            isVisible ? 'animate-fade-up [animation-delay:200ms]' : 'opacity-0'
          }`}
        >
          <Mail size={16} />
          hello@swab.design
        </a>

        <form
          onSubmit={handleSubmit}
          className={`space-y-5 ${isVisible ? 'animate-fade-up [animation-delay:250ms]' : 'opacity-0'}`}
        >
          <div>
            <label htmlFor="name" className="font-body text-sm font-medium text-foreground block mb-1.5">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 font-body text-sm bg-card border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="font-body text-sm font-medium text-foreground block mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 font-body text-sm bg-card border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="font-body text-sm font-medium text-foreground block mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="w-full px-4 py-3 font-body text-sm bg-card border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-accent-foreground font-body font-medium text-sm rounded tracking-wide uppercase ripple elevation-1 hover:elevation-2 active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none transition-all duration-200"
          >
            {sending ? 'Sending...' : 'Send Message'}
            <Send size={15} />
          </button>
        </form>
      </div>
    </section>
  );
}
