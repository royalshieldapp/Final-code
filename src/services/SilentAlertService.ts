const SilentAlertService = {
  async sendSilentAlert(reason: string) {
    console.info('Silent alert dispatched', reason, new Date().toISOString());
    return { success: true, reason };
  },
};

export default SilentAlertService;
