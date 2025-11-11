export type SendEmailParams = {
  to: string;
  subject: string;
  body: string;
};

export const sendEmail = async ({ to, subject, body }: SendEmailParams) => {
  console.log(`[mock-email] Sending email to ${to}: ${subject}`);
  console.log(body);

  // Simulate async delivery latency.
  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log(`[mock-email] Email delivered to ${to}`);
};
