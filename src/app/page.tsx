'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Send, Languages, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';

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
      'donner': 'jox', 'prendre': 'jël', 'savoir': 'xam', 'pouvoir': 'mën', 'vouloir': 'bëgg', 'aimer': 'soxla', 'travailler': 'liggéey', 'acheter': 'jënd', 'vendre': 'jaay', 'chercher': 'wut', 'trouver': 'gis', 'perdre': 'reer', 'oublier': 'fatte', 'apprendre': 'jàng', 'enseigner': 'jàngale', 'lire': 'jàng', 'écrire': 'bind', 'comprendre': 'fàhm', 'répondre': 'tontu', 'demander': 'laaj', 'dire': 'wax', 'entendre': 'dégg', 'sentir': 'xonq', 'toucher': 'jàpp', 'marcher': 'daw', 'courir': 'yàgg', 'danser': 'fecc', 'chanter': 'woy', 'jouer': 'yëkkati', 'rire': 'reer', 'pleurer': 'ñaan', 'se réveiller': 'jiitu', 'laver': 'sax', 'nettoyer': 'sax', 'cuisiner': 'togg', 'construire': 'jégg', 'casser': 'pëcc', 'réparer': 'tëral', 'ouvrir': 'ubbi', 'fermer': 'tëj', 'commencer': 'tàmbalee', 'finir': 'jeex', 'arrêter': 'taxaw', 'continuer': 'delloo', 'attendre': 'xaar', 'partir': 'dem', 'arriver': 'jëm', 'entrer': 'dugg', 'sortir': 'génn', 'monter': 'jeex', 'descendre': 'dindi', 'tomber': 'daw', 'voler': 'far', 'nager': 'yemmeeku', 'mourir': 'dee', 'naître': 'jibbu', 'grandir': 'mag', 'devenir': 'jàppante',
      'feu': 'safara', 'terre': 'suuf', 'air': 'wuutlu', 'soleil': 'njax', 'lune': 'weer', 'étoile': 'béthio', 'ciel': 'asamaan', 'nuage': 'meele', 'pluie': 'taw', 'vent': 'wuutlu', 'mer': 'gej', 'rivière': 'dex', 'montagne': 'tund', 'forêt': 'kër', 'arbre': 'garab', 'fleur': 'cere', 'herbe': 'cuub', 'pierre': 'paal', 'sable': 'dëbb', 'porte': 'bunt', 'fenêtre': 'palanteer', 'toit': 'taal', 'mur': 'mbedd', 'chambre': 'nëb', 'cuisine': 'kër-u-togg', 'salle': 'biir', 'lit': 'nëb', 'table': 'taabalu', 'chaise': 'kër-u-toog', 'route': 'yoon', 'voiture': 'otoo', 'vélo': 'welo', 'bateau': 'gaal', 'avion': 'awiyoŋ', 'train': 'sàmm', 'hôpital': 'hôpital', 'marché': 'maarse', 'magasin': 'butik', 'restaurant': 'kër-u-lekk', 'hôtel': 'oteel', 'banque': 'baŋk', 'poste': 'post', 'police': 'sàmm', 'église': 'kër-u-Yàlla', 'mosquée': 'jàmmu', 'matin': 'suba', 'midi': 'ànddu', 'soir': 'ngoon', 'semaine': 'ayubés', 'mois': 'weer', 'année': 'at', 'hier': 'démb', "aujourd'hui": 'tey', 'demain': 'suba', 'nom': 'tur', 'âge': 'at', 'homme': 'góor', 'femme': 'jigéen', 'bébé': 'nënët', 'tête': 'bopp', 'cheveux': 'kaani', 'visage': 'kanam', 'œil': 'bët', 'oreille': 'noppi', 'nez': 'baaraam', 'bouche': 'gémmiñ', 'dent': 'bëñ', 'langue': 'làmmiñ', 'cou': 'bakkan', 'épaule': 'kañ', 'bras': 'loxo', 'main': 'loxo', 'doigt': 'baaraam', 'poitrine': 'biir', 'dos': 'biir', 'ventre': 'biir', 'jambe': 'tànk', 'pied': 'tànk', 'peau': 'der', 'sang': 'deret', 'os': 'yax', 'cœur': 'xol', 'nourriture': 'lekk', 'riz': 'cëb', 'viande': 'yàpp', 'poisson': 'jën', 'légume': 'tugub', 'fruit': 'gewël', 'lait': 'meew', 'œuf': 'ner', 'sel': 'sëlt', 'sucre': 'sëkër', 'huile': 'tuti', 'vêtement': 'yere', 'chemise': 'yere', 'pantalon': 'yere', 'robe': 'yere', 'chaussure': 'kondóng', 'chapeau': 'koppu', 'couleur': 'melo', 'rouge': 'xonq', 'bleu': 'baxa', 'vert': 'vert', 'jaune': 'melo', 'noir': 'ñuul', 'blanc': 'weex', 'grand': 'mag', 'petit': 'tuuti', 'bon': 'baax', 'mauvais': 'bon', 'nouveau': 'bees', 'vieux': 'mag', 'chaud': 'tang', 'froid': 'sedd', 'sec': 'yàgg', 'mouillé': 'sëdd'
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
      'dem': 'aller',
      'jox': 'donner', 'jël': 'prendre', 'xam': 'savoir', 'mën': 'pouvoir', 'bëgg': 'vouloir', 'mbeuguel': 'aimer', 'jënd': 'acheter', 'jaay': 'vendre', 'wut': 'chercher', 'reer': 'perdre/rire', 'fatte': 'oublier', 'jàng': 'apprendre/lire', 'jàngale': 'enseigner', 'bind': 'écrire', 'fàhm': 'comprendre', 'tontu': 'répondre', 'laaj': 'demander', 'xonq': 'sentir', 'jàpp': 'toucher', 'daw': 'marcher/tomber', 'yàgg': 'courir/sec', 'fecc': 'danser', 'woy': 'chanter', 'yëkkati': 'jouer', 'ñaan': 'pleurer', 'jiitu': 'se réveiller', 'sax': 'laver/nettoyer', 'togg': 'cuisiner', 'jégg': 'construire', 'pëcc': 'casser', 'tëral': 'réparer', 'ubbi': 'ouvrir', 'tëj': 'fermer', 'tàmbalee': 'commencer', 'jeex': 'finir/monter', 'taxaw': 'arrêter', 'delloo': 'continuer', 'xaar': 'attendre', 'jëm': 'arriver', 'dugg': 'entrer', 'génn': 'sortir', 'dindi': 'descendre', 'far': 'voler', 'yemmeeku': 'nager', 'dee': 'mourir', 'jibbu': 'naître', 'jàppante': 'devenir', 'safara': 'feu', 'suuf': 'terre', 'wuutlu': 'air/vent', 'njax': 'soleil', 'weer': 'lune/mois', 'béthio': 'étoile', 'asamaan': 'ciel', 'meele': 'nuage', 'taw': 'pluie', 'gej': 'mer', 'dex': 'rivière', 'tund': 'montagne', 'garab': 'arbre', 'cere': 'fleur', 'cuub': 'herbe', 'paal': 'pierre', 'dëbb': 'sable', 'bunt': 'porte', 'palanteer': 'fenêtre', 'taal': 'toit', 'mbedd': 'mur', 'nëb': 'chambre/lit', 'kër-u-togg': 'cuisine', 'biir': 'salle/poitrine/dos/ventre', 'taabalu': 'table', 'kër-u-toog': 'chaise', 'yoon': 'route', 'otoo': 'voiture', 'welo': 'vélo', 'gaal': 'bateau', 'awiyoŋ': 'avion', 'sàmm': 'train/police', 'daara': 'école', 'maarse': 'marché', 'butik': 'magasin', 'kër-u-lekk': 'restaurant', 'oteel': 'hôtel', 'baŋk': 'banque', 'post': 'poste', 'kër-u-Yàlla': 'église', 'jàmmu': 'mosquée', 'bés': 'nuit', 'suba': 'matin/demain', 'ànddu': 'midi', 'ngoon': 'soir', 'ayubés': 'semaine', 'at': 'année/âge', 'démb': 'hier', 'tey': "aujourd'hui", 'tur': 'nom', 'góor': 'homme', 'jigéen': 'femme', 'doom': 'enfant', 'nënët': 'bébé', 'bopp': 'tête', 'kaani': 'cheveux', 'kanam': 'visage', 'bët': 'œil', 'noppi': 'oreille', 'baaraam': 'nez/doigt', 'gémmiñ': 'bouche', 'bëñ': 'dent', 'làmmiñ': 'langue', 'bakkan': 'cou', 'kañ': 'épaule', 'loxo': 'bras/main', 'tànk': 'jambe/pied', 'der': 'peau', 'deret': 'sang', 'yax': 'os', 'xol': 'cœur', 'cëb': 'riz', 'yàpp': 'viande', 'jën': 'poisson', 'tugub': 'légume', 'gewël': 'fruit', 'meew': 'lait', 'ner': 'œuf', 'sëlt': 'sel', 'sëkër': 'sucre', 'tuti': 'huile', 'yere': 'vêtement/chemise/pantalon/robe', 'kondóng': 'chaussure', 'koppu': 'chapeau', 'melo': 'couleur/jaune', 'baxa': 'bleu', 'vert': 'vert', 'ñuul': 'noir', 'weex': 'blanc', 'tuuti': 'petit', 'baax': 'bon', 'bon': 'mauvais', 'bees': 'nouveau', 'tang': 'chaud', 'sedd': 'froid', 'sëdd': 'mouillé',
      'Nanga def': 'Comment allez-vous?', 'Mangi fi rekk': 'Je vais bien', 'Naka nga tudd': 'Comment vous appelez-vous?', 'Maa ngi tudd...': "Je m'appelle...", 'Ñaata jërëjëf': 'Merci beaucoup', 'Amul solo': 'De rien', 'Baal ma': 'Excusez-moi', 'Waaw': 'Oui', 'Déedéet': 'Non', 'Ñaata ci kàttan': 'À bientôt', 'Jàmm ngeen si jamm': 'Au revoir (paix sur vous)', 'Inshaa Allah': 'Si Dieu le veut', 'Alxamdulillaah': 'Dieu merci'
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto max-w-5xl h-screen flex flex-col relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border border-white/20 p-6 rounded-2xl mt-4 mx-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-3 rounded-2xl shadow-lg">
                  <Languages className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-1">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Traducteur Français-Wolof
                </h1>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-3 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 hover:scale-105"
              title="Effacer la conversation"
            >
              <RotateCcw className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 mx-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-xs lg:max-w-lg px-6 py-4 rounded-3xl shadow-lg relative group transition-all duration-300 hover:scale-105 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white shadow-emerald-200'
                    : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-white/50 shadow-green-100'
                }`}
              >
                <div className="text-base leading-relaxed">
                  {message.content}
                </div>
                
                {message.language && (
                  <div className={`text-xs mt-3 flex items-center space-x-2 ${
                    message.type === 'user' ? 'text-emerald-100' : 'text-gray-500'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      message.language === 'fr' ? 'bg-blue-400' : 'bg-yellow-400'
                    }`}></div>
                    <span className="font-medium">
                      {message.language === 'fr' ? '🇫🇷 Français' : '🇸🇳 Wolof'}
                    </span>
                  </div>
                )}
                
                {message.type === 'bot' && (
                  <button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                    title="Copier"
                  >
                    {copiedId === message.id ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {isTranslating && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Traduction en cours...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-6 rounded-2xl mb-4 mx-4 shadow-lg">
          {/* Language Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={switchLanguages}
              className="group flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-2xl transition-all duration-300 border border-emerald-200 hover:border-emerald-300 shadow-sm hover:shadow-md"
            >
              <div className={`flex items-center space-x-2 transition-all duration-200 ${
                sourceLanguage === 'fr' ? 'text-emerald-700 font-semibold scale-110' : 'text-gray-500'
              }`}>
                <span className="text-lg">🇫🇷</span>
                <span className="text-sm font-medium">Français</span>
              </div>
              <div className="bg-gradient-to-r from-emerald-400 to-green-400 p-2 rounded-full group-hover:rotate-180 transition-transform duration-300">
                <Languages className="h-4 w-4 text-white" />
              </div>
              <div className={`flex items-center space-x-2 transition-all duration-200 ${
                sourceLanguage === 'wo' ? 'text-emerald-700 font-semibold scale-110' : 'text-gray-500'
              }`}>
                <span className="text-lg">🇸🇳</span>
                <span className="text-sm font-medium">Wolof</span>
              </div>
            </button>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Tapez votre texte en ${sourceLanguage === 'fr' ? 'français' : 'wolof'}...`}
                className="w-full px-6 py-4 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white/70 backdrop-blur-sm"
                disabled={isTranslating}
              />
              {inputText && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!inputText.trim() || isTranslating}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-4 text-center flex items-center justify-center space-x-2">
            <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
            <span>Dictionnaire de base français-wolof</span>
            <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
            <span>Appuyez sur Entrée pour traduire</span>
            <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FrenchWolofTranslator;