export const CONTACT_EMAIL_ADDRESS = "successorsf1@gmail.com";
export const CONTACT_EMAIL_SUBJECT =
  "Partnership enquiry — Successors F1 in Schools";
export const CONTACT_EMAIL_BODY = `Hi Successors,

I\u2019m reaching out regarding:

Name:
Organisation:
Contact:

Thanks,`;

type ComposeOptions = {
  to?: string;
  subject?: string;
  body?: string;
};

export function buildGmailComposeUrl(options: ComposeOptions = {}) {
  const to = options.to ?? CONTACT_EMAIL_ADDRESS;
  const subject = options.subject ?? CONTACT_EMAIL_SUBJECT;
  const body = options.body ?? CONTACT_EMAIL_BODY;
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to,
    su: subject,
    body,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function buildOutlookComposeUrl(options: ComposeOptions = {}) {
  const to = options.to ?? CONTACT_EMAIL_ADDRESS;
  const subject = options.subject ?? CONTACT_EMAIL_SUBJECT;
  const body = options.body ?? CONTACT_EMAIL_BODY;
  const params = new URLSearchParams({
    to,
    subject,
    body,
  });

  return `https://outlook.office.com/mail/deeplink/compose?${params.toString()}`;
}

export function buildEmailDraftClipboardText(options: ComposeOptions = {}) {
  const to = options.to ?? CONTACT_EMAIL_ADDRESS;
  const subject = options.subject ?? CONTACT_EMAIL_SUBJECT;
  const body = options.body ?? CONTACT_EMAIL_BODY;

  return [`To: ${to}`, `Subject: ${subject}`, "", body].join("\n");
}
