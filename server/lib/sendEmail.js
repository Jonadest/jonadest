import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends an email via SendGrid.
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Subject line
 * @param {string} options.html - HTML content
 */
export const sendEmail = async ({ to, subject, html }) => {
  if (!to || !subject || !html) {
    console.error('❌ Missing required email fields');
    throw new Error('Missing required email fields');
  }

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL || 'JBC@em8871.jannybeautycare.com',
    subject,
    html,
    mailSettings: {
      sandboxMode: {
        enable: process.env.NODE_ENV === 'test', // use sandbox only during test
      },
    },
  };

  try {
    await sgMail.send(msg);
    console.log(`📧 Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid error:', {
      message: error.message,
      code: error.code,
      body: error.response?.body,
    });
    throw error;
  }
};
