import { useState, useRef, type FormEvent } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 0.4, 1], [60, 0, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const formX = useTransform(scrollYProgress, [0, 0.35], [-40, 0]);
  const formOpacity = useTransform(scrollYProgress, [0, 0.25, 0.35], [0, 0, 1]);

  const [sending, setSending] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! I'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <section ref={sectionRef} id="contact" className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container max-w-xl">
        <motion.h2
          style={{ y, opacity }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
        >
          Get in Touch
        </motion.h2>

        <motion.div
          style={{ opacity, scaleX: useTransform(scrollYProgress, [0, 0.25], [0, 1]) }}
          className="w-12 h-0.5 bg-accent mx-auto mb-6 origin-center"
        />

        <motion.p
          style={{ y, opacity }}
          className="font-body text-center text-muted-foreground text-sm mb-4"
        >
          Have a project in mind? Let's talk.
        </motion.p>

        <motion.a
          href="mailto:swalihblack@gmail.com"
          style={{ y, opacity }}
          className="flex items-center justify-center gap-2 font-body text-accent hover:text-accent/80 text-sm mb-10 transition-colors"
        >
          <Mail size={16} />
          hello@swab.design
        </motion.a>

        <motion.form
          onSubmit={handleSubmit}
          style={{ x: formX, opacity: formOpacity }}
          className="space-y-5"
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
        </motion.form>
      </div>
    </section>
  );
}
