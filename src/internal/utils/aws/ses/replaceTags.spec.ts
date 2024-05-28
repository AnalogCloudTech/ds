import {
  replaceTags,
  replaceTagsOnDemandEmails,
} from '@/internal/utils/aws/ses/replaceTags';

describe('test ReplaceTags', () => {
  it('should replaceTagsOnDemandEmails correctly', function () {
    const replaced = replaceTagsOnDemandEmails(
      "<h2>Hi <strong>{{LEAD_FIRST_NAME}},</strong></h2><p>It's <strong>{{MEMBER_FIRST_NAME}}</strong> from " +
        '<strong>{{MEMBER_BROKER_NAME}}</strong></p><p>Thank you for requesting your free copy of my book!</p><p>Inside, ' +
        "you'll find valuable information that you can use. I can't wait to share it with you!</p><p>I know you will find " +
        'my tips useful.</p><p>Here is the electronic version of my book</p>' +
        '<p><a href="https://example.com">' +
        'https://yvonnelopez.book.live/read-mortgage-lenders-agents-book</a></p><p>&nbsp;</p><p>If you are interested ' +
        'in co-branding the above brochures</p><p><a href="https://example.com">book a quick ' +
        'call</a> to see the inside of the brochures and get me your information for the branding.</p><p>&nbsp;</p>' +
        '<p>&nbsp;</p><p><br>&nbsp;</p>',
      {
        LEAD_FIRST_NAME: 'Joana',
        MEMBER_FIRST_NAME: 'John',
        MEMBER_BROKER_NAME: 'Broker',
      },
    );
    expect(replaced).toBe(
      "<h2>Hi <strong>Joana,</strong></h2><p>It's <strong>John</strong> from <strong>Broker</strong></p>" +
        "<p>Thank you for requesting your free copy of my book!</p><p>Inside, you'll find valuable information that " +
        "you can use. I can't wait to share it with you!</p><p>I know you will find my tips useful.</p><p>Here is " +
        'the electronic version of my book</p><p><a href="https://example.com">' +
        'https://yvonnelopez.book.live/read-mortgage-lenders-agents-book</a></p><p>&nbsp;</p><p>If you are interested in ' +
        'co-branding the above brochures</p><p><a href="https://example.com">book a quick call</a> ' +
        'to see the inside of the brochures and get me your information for the branding.</p><p>&nbsp;</p><p>&nbsp;</p><p>' +
        '<br>&nbsp;</p>',
    );
  });

  it('should replaceTags successfully', function () {
    const replaced = replaceTags(
      '{{CUSTOMER_NAME}} {{COACH_NAME}} {{ZOOM_LINK}} {{MEETING_DATE_TIME}}',
      {
        '{{CUSTOMER_NAME}}': 'Joana',
        '{{COACH_NAME}}': 'John',
        '{{ZOOM_LINK}}': 'https://zoom.com',
        '{{MEETING_DATE_TIME}}': '2021-09-01',
      },
    );
    expect(replaced).toBe('Joana John https://zoom.com 2021-09-01');
  });
});
