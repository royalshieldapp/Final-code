const UrlCheckService = {
  scan(url: string) {
    const score = url.includes('unsafe') ? 'malicious' : url.includes('http:') ? 'suspicious' : 'safe';
    return new Promise<{ level: string; tips: string }>((resolve) => {
      setTimeout(() => {
        resolve({ level: score, tips: 'Mocked analysis – integrate real scanner here.' });
      }, 400);
    });
  },
};

export default UrlCheckService;
