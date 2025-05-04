import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

export default function FAQ() {
  const faqItems = [
    {
      question: 'What is cryptocurrency?',
      answer: 'Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on a technology called blockchain. It is typically not issued by any central authority, making it theoretically immune to government interference or manipulation.'
    },
    {
      question: 'How does blockchain work?',
      answer: 'A blockchain is a distributed ledger that records all transactions across a network of computers. Each block contains a number of transactions, and once a block is added to the chain, the data becomes immutable and transparent to all participants in the network.'
    },
    {
      question: 'What is mining and why is it important?',
      answer: 'Mining is the process by which new cryptocurrency coins are created and transactions are added to the blockchain. Miners use computer power to solve complex mathematical problems, and when they succeed, they are rewarded with new coins. This process secures the network and verifies transactions.'
    },
    {
      question: 'How do I keep my cryptocurrency safe?',
      answer: 'To keep your cryptocurrency safe, use secure wallets (hardware wallets for large amounts), enable two-factor authentication, use strong unique passwords, keep your private keys private, be cautious of phishing attempts, and consider cold storage for long-term holdings.'
    }
  ];

  return (
    <Card className="bg-light rounded-xl shadow-lg overflow-hidden">
      <CardContent className="p-6 border-b">
        <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
      </CardContent>
      
      <Accordion type="single" collapsible className="divide-y">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-0">
            <AccordionTrigger className="p-6 text-left hover:no-underline">
              <h4 className="font-medium text-lg">{item.question}</h4>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-0">
              <p className="opacity-70">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
