# Education Notes Website

यह एक Next.js आधारित वेबसाइट है जो RBSE और CBSE के छात्रों के लिए स्टडी मटेरियल और RBSE के पुराने प्रश्नपत्र (Old Papers)  प्रदान करती है।

## विशेषताएं

- RBSE और CBSE के लिए अलग-अलग सेक्शन
- क्लास 10th, और 12th के लिए नोट्स
- विभिन्न विषयों के लिए अध्याय-वार नोट्स
- Indian Gk के नोट्स
- पिछले वर्षों के प्रश्नपत्र (2020 तक)
- PDF फॉर्मेट में स्टडी मटेरियल
- रेस्पॉन्सिव डिज़ाइन
- SEO फ्रेंडली

## टेक्नोलॉजीज

- Next.js 14
- React
- TypeScript / JavaScript
- CSS3

## इंस्टॉलेशन

1. प्रोजेक्ट को क्लोन करें:
```bash
git clone https://github.com/StockCodeIn/pathshalanoteshub.git
```

2. प्रोजेक्ट डायरेक्टरी में जाएं:
```bash
cd pathshalanoteshub
```

3. डिपेंडेंसीज इंस्टॉल करें:
```bash
npm install
```

4. डेवलपमेंट सर्वर शुरू करें:
```bash
npm run dev
```

5. ब्राउज़र में खोलें:
```
http://localhost:3000
```

## API इंटीग्रेशन

PDF फाइल्स को प्राप्त करने के लिए आपको एक API सेटअप करना होगा। API का URL निम्नलिखित फॉर्मेट में होना चाहिए:

```
https://api.example.com/{board}/{class}/{subject}/chapter/{chapterId}
```

## कॉन्ट्रिब्यूशन

1. इस रिपॉजिटरी को फोर्क करें
2. एक नई ब्रांच बनाएं (`git checkout -b feature/amazing-feature`)
3. अपने चेंजेस कमिट करें (`git commit -m 'Add some amazing feature'`)
4. ब्रांच को पुश करें (`git push origin feature/amazing-feature`)
5. एक पुल रिक्वेस्ट खोलें

## लाइसेंस

MIT License - देखें [LICENSE](LICENSE) फाइल 