'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Send, Languages, RotateCcw, Copy, Check } from 'lucide-react';

const FrenchWolofTranslator = () => {
  type Message = {
    id: number;
    type: string;
    content: string;
    timestamp: Date;
    language?: string;
    original?: string;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Salaam aleekum ! Je suis votre assistant de traduction français-wolof. Tapez votre texte et je le traduirai pour vous.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('fr');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Dictionnaire de traductions de base (à étendre)
  type TranslationDict = {
    [key: string]: { [phrase: string]: string }
  };
  const translations: TranslationDict = {
    'fr-wo': {
      'bonjour': 'asalaam aleekum',
      'comment allez-vous': 'naka nga def',
      'merci': 'jërejëf',
      'au revoir': 'ba beneen',
      'oui': 'waaw',
      'non': 'déedéet',
      'comment vous appelez-vous': 'naka nga tudd',
      'je m\'appelle': 'maa ngi tudd',
      'eau': 'ndox',
      'pain': 'mburu',
      'maison': 'kër',
      'famille': 'waa kër',
      'enfant': 'xale',
      'mère': 'yaay',
      'père': 'baay',
      'frère': 'mag',
      'sœur': 'rakk',
      'ami': 'xarit',
      'école': 'ekol',
      'travail': 'liggéey',
      'argent': 'xaalis',
      'temps': 'waxtu',
      'jour': 'bës',
      'nuit': 'guddi',
      'manger': 'lekk',
      'boire': 'naan',
      'dormir': 'nelaw',
      'parler': 'wax',
      'écouter': 'dégg',
      'voir': 'gis',
      'venir': 'ñëw',
      'aller': 'dem',
    },
    'wo-fr': {
      'asalaam aleekum': 'bonjour',
      'naka nga def': 'comment allez-vous',
      'jërejëf': 'merci',
      'ba beneen': 'au revoir',
      'waaw': 'oui',
      'déedéet': 'non',
      'naka nga tudd': 'comment vous appelez-vous',
      'maa ngi tudd': 'je m\'appelle',
      'ndox': 'eau',
      'mburu': 'pain',
      'kër': 'maison',
      'waa kër': 'famille',
      'xale': 'enfant',
      'yaay': 'mère',
      'baay': 'père',
      'mag': 'frère',
      'rakk': 'sœur',
      'xarit': 'ami',
      'ekol': 'école',
      'liggéey': 'travail',
      'xaalis': 'argent',
      'waxtu': 'temps',
      'bës': 'jour',
      'guddi': 'nuit',
      'lekk': 'manger',
      'naan': 'boire',
      'nelaw': 'dormir',
      'wax': 'parler',
      'dégg': 'écouter',
      'gis': 'voir',
      'ñëw': 'venir',
      'dem': 'aller'
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const translateText = (text: string, fromLang: string, toLang: string) => {
    const dictKey = `${fromLang}-${toLang}`;
    const normalizedText = text.trim().toLowerCase();

    if (
      translations[dictKey] &&
      (translations[dictKey] as { [key: string]: string })[normalizedText]
    ) {
      return (translations[dictKey] as { [key: string]: string })[normalizedText];
    }
    if (translations[dictKey] && translations[dictKey][normalizedText]) {
      return translations[dictKey][normalizedText];
    }
    
    // Recherche partielle
    for (const [key, value] of Object.entries(translations[dictKey] || {})) {
      if (normalizedText.includes(key) || key.includes(normalizedText)) {
        return value;
      }
    }
    
    return `Traduction non disponible pour "${text}". Ajout en cours au dictionnaire...`;
  };

  const handleSubmit = () => {
    if (!inputText.trim() || isTranslating) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
      language: sourceLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTranslating(true);

    // Simulation d'un délai de traduction
    setTimeout(() => {
      const targetLang = sourceLanguage === 'fr' ? 'wo' : 'fr';
      const translation = translateText(inputText, sourceLanguage, targetLang);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: translation,
        timestamp: new Date(),
        language: targetLang,
        original: inputText
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTranslating(false);
    }, 1000);

    setInputText('');
  };
  interface KeyPressEvent extends React.KeyboardEvent<HTMLInputElement> {}

  const handleKeyPress = (e: KeyPressEvent): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  // const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   if (!inputText.trim() || isTranslating) return;

  //   const userMessage = {
  //     id: Date.now(),
  //     type: 'user',
  //     content: inputText,
  //     timestamp: new Date(),
  //     language: sourceLanguage
  //   };

  //   setMessages(prev => [...prev, userMessage]);
  //   setIsTranslating(true);

  //   // Simulation d'un délai de traduction
  //   setTimeout(() => {
  //     const targetLang = sourceLanguage === 'fr' ? 'wo' : 'fr';
  //     const translation = translateText(inputText, sourceLanguage, targetLang);
      
  //     const botMessage = {
  //       id: Date.now() + 1,
  //       type: 'bot',
  //       content: translation,
  //       timestamp: new Date(),
  //       language: targetLang,
  //       original: inputText
  //     };

  //     setMessages(prev => [...prev, botMessage]);
  //     setIsTranslating(false);
  //   }, 1000);

  //   setInputText('');
  // };

  const switchLanguages = () => {
    setSourceLanguage(prev => prev === 'fr' ? 'wo' : 'fr');
  };

  const copyToClipboard = async (text: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Salaam aleekum ! Je suis votre assistant de traduction français-wolof. Tapez votre texte et je le traduirai pour vous.',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-lg">
                <Languages className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Traducteur Français-Wolof</h1>
                <p className="text-sm text-gray-500">Assistant de traduction intelligent</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Effacer la conversation"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm relative group ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <div className="text-sm mb-1">
                  {message.content}
                </div>
                
                {message.language && (
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.language === 'fr' ? '🇫🇷 Français' : '🇸🇳 Wolof'}
                  </div>
                )}
                
                {message.type === 'bot' && (
                  <button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                    title="Copier"
                  >
                    {copiedId === message.id ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-500" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {isTranslating && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          {/* Language Toggle */}
          <div className="flex justify-center mb-4">
            <button
              onClick={switchLanguages}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <span className={`text-sm font-medium ${sourceLanguage === 'fr' ? 'text-blue-600' : 'text-gray-500'}`}>
                🇫🇷 Français
              </span>
              <Languages className="h-4 w-4 text-gray-400" />
              <span className={`text-sm font-medium ${sourceLanguage === 'wo' ? 'text-green-600' : 'text-gray-500'}`}>
                🇸🇳 Wolof
              </span>
            </button>
          </div>

          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Tapez votre texte en ${sourceLanguage === 'fr' ? 'français' : 'wolof'}...`}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTranslating}
            />
            <button
              onClick={handleSubmit}
              disabled={!inputText.trim() || isTranslating}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-2 text-center">
            Dictionnaire de base français-wolof • Appuyez sur Entrée pour traduire
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrenchWolofTranslator;