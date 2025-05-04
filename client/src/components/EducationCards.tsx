import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { Link2, Coins, Wallet } from 'lucide-react';

export default function EducationCards() {
  const educationCards = [
    {
      title: 'Blockchain Basics',
      description: 'Learn how blockchain technology works and why it\'s revolutionary for digital transactions.',
      icon: <Link2 className="h-24 w-24 text-white opacity-25" />,
      bgColor: 'bg-primary',
      link: '/education#blockchain'
    },
    {
      title: 'Cryptocurrency Mining',
      description: 'Understand the process of mining, consensus mechanisms, and how new coins are created.',
      icon: <Coins className="h-24 w-24 text-white opacity-25" />,
      bgColor: 'bg-secondary',
      link: '/education#mining'
    },
    {
      title: 'Wallets & Security',
      description: 'Learn about cryptocurrency wallets, private keys, and best practices for securing your digital assets.',
      icon: <Wallet className="h-24 w-24 text-white opacity-25" />,
      bgColor: 'bg-accent',
      link: '/education#wallets'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {educationCards.map((card, index) => (
        <Card key={index} className="bg-light rounded-xl shadow-lg overflow-hidden">
          <div className={`h-48 ${card.bgColor} relative overflow-hidden`}>
            <div className="absolute inset-0 flex items-center justify-center">
              {card.icon}
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="opacity-70 mb-4">{card.description}</p>
            <Link href={card.link}>
              <div className="text-primary font-medium hover:underline cursor-pointer">Read more →</div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
