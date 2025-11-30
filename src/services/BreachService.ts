const BreachService = {
  check(emailOrUser: string) {
    const breached = emailOrUser.toLowerCase().includes('test');
    return new Promise<{ breached: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          breached,
          message: breached ? 'Credentials found in breach' : 'No breach found',
        });
      }, 500);
    });
  },
};

export default BreachService;
