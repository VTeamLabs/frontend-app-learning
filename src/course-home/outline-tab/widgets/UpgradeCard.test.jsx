import React from 'react';
import { Factory } from 'rosie';

import { initializeMockApp, render, screen } from '../../../setupTest';
import UpgradeCard from './UpgradeCard';

initializeMockApp();
jest.mock('@edx/frontend-platform/analytics');
const dateNow = new Date('2021-04-13T11:01:58.000Z');
jest
  .spyOn(global.Date, 'now')
  .mockImplementation(() => dateNow.valueOf());

describe('Upgrade Card', () => {
  function buildAndRender(attributes) {
    const upgradeCardData = Factory.build('upgradeCardData', { ...attributes });
    render(<UpgradeCard {...upgradeCardData} />);
  }

  it('does not render when there is no verified mode', async () => {
    buildAndRender({ verifiedMode: null });
    expect(screen.queryByRole('link', { name: 'Upgrade for $149' })).not.toBeInTheDocument();
  });

  it('renders non-FBE when there is a verified mode but no FBE', async () => {
    buildAndRender();
    expect(screen.getByRole('heading', { name: 'Pursue a verified certificate' })).toBeInTheDocument();
    expect(screen.getByText(/Earn a.*?of completion to showcase on your resume/s).textContent).toMatch('Earn a verified certificate of completion to showcase on your resume');
    expect(screen.getByText(/Support our.*?at edX/s).textContent).toMatch('Support our non-profit mission at edX');
    expect(screen.getByRole('link', { name: 'Upgrade for $149' })).toBeInTheDocument();
  });

  it('renders non-FBE when there is a verified mode and access expiration, but no content gating', async () => {
    const expirationDate = new Date(dateNow);
    expirationDate.setMinutes(expirationDate.getMinutes() + 45);
    buildAndRender({
      accessExpiration: {
        expirationDate: expirationDate.toString(),
      },
    });
    expect(screen.getByRole('heading', { name: 'Pursue a verified certificate' })).toBeInTheDocument();
    expect(screen.getByText(/Earn a.*?of completion to showcase on your resume/s).textContent).toMatch('Earn a verified certificate of completion to showcase on your resume');
    expect(screen.getByText(/Support our.*?at edX/s).textContent).toMatch('Support our non-profit mission at edX');
    expect(screen.getByRole('link', { name: 'Upgrade for $149' })).toBeInTheDocument();
  });

  it('renders non-FBE when there is a verified mode and content gating, but no access expiration', async () => {
    buildAndRender({
      contentTypeGatingEnabled: true,
    });
    expect(screen.getByRole('heading', { name: 'Pursue a verified certificate' })).toBeInTheDocument();
    expect(screen.getByText(/Earn a.*?of completion to showcase on your resume/s).textContent).toMatch('Earn a verified certificate of completion to showcase on your resume');
    expect(screen.getByText(/Support our.*?at edX/s).textContent).toMatch('Support our non-profit mission at edX');
    expect(screen.getByRole('link', { name: 'Upgrade for $149' })).toBeInTheDocument();
  });

  it('renders FBE expiration within an hour properly', async () => {
    const expirationDate = new Date(dateNow);
    expirationDate.setMinutes(expirationDate.getMinutes() + 45);
    buildAndRender({
      accessExpiration: {
        expirationDate: expirationDate.toString(),
      },
      contentTypeGatingEnabled: true,
    });
    expect(screen.getByRole('heading', { name: 'Course Access Expiration' })).toBeInTheDocument();
    expect(screen.getByText('Less than 1 hour left')).toBeInTheDocument();
    expect(screen.getByText(/You will lose all access to this course.*?on/s).textContent).toMatch('You will lose all access to this course, including any progress, on April 13.');
    expect(screen.getByText(/Upgrading your course enables you/s).textContent).toMatch('Upgrading your course enables you to pursue a verified certificate and unlocks numerous features. Learn more about the benefits of upgrading.');
    expect(screen.getByRole('link', { name: 'Upgrade for $149' })).toBeInTheDocument();
  });

  it('renders FBE expiration within 24 hours properly', async () => {
    const expirationDate = new Date(dateNow);
    expirationDate.setHours(expirationDate.getHours() + 12);
    buildAndRender({
      accessExpiration: {
        expirationDate: expirationDate.toString(),
      },
      contentTypeGatingEnabled: true,
    });
    expect(screen.getByRole('heading', { name: 'Course Access Expiration' })).toBeInTheDocument();
    expect(screen.getByText('12 hours left')).toBeInTheDocument();
    expect(screen.getByText(/You will lose all access to this course.*?on/s).textContent).toMatch('You will lose all access to this course, including any progress, on April 13.');
    expect(screen.getByText(/Upgrading your course enables you/s).textContent).toMatch('Upgrading your course enables you to pursue a verified certificate and unlocks numerous features. Learn more about the benefits of upgrading.');
    expect(screen.getByRole('link', { name: 'Upgrade for $149' })).toBeInTheDocument();
  });

  it('renders FBE expiration within 7 days properly', async () => {
    const expirationDate = new Date(dateNow);
    expirationDate.setDate(expirationDate.getDate() + 6);
    buildAndRender({
      accessExpiration: {
        expirationDate: expirationDate.toString(),
      },
      contentTypeGatingEnabled: true,
    });
    expect(screen.getByRole('heading', { name: 'Course Access Expiration' })).toBeInTheDocument();
    expect(screen.getByText('6 days left')).toBeInTheDocument(); // setting the time to 12 will mean that it's slightly less than 12
    expect(screen.getByText(/You will lose all access to this course.*?on/s).textContent).toMatch('You will lose all access to this course, including any progress, on April 19.');
    expect(screen.getByText(/Upgrading your course enables you/s).textContent).toMatch('Upgrading your course enables you to pursue a verified certificate and unlocks numerous features. Learn more about the benefits of upgrading.');
    expect(screen.getByRole('link', { name: 'Upgrade for $149' })).toBeInTheDocument();
  });

  it('renders FBE expiration greater than 7 days properly', async () => {
    const expirationDate = new Date(dateNow);
    expirationDate.setDate(expirationDate.getDate() + 14);
    buildAndRender({
      accessExpiration: {
        expirationDate: expirationDate.toString(),
      },
      contentTypeGatingEnabled: true,
    });
    expect(screen.getByRole('heading', { name: 'Upgrade your course today' })).toBeInTheDocument();
    expect(screen.getByText(/Course access will expire/s).textContent).toMatch('Course access will expire April 27');
    expect(screen.getByText(/Earn a.*?of completion to showcase on your resume/s).textContent).toMatch('Earn a verified certificate of completion to showcase on your resume');
    expect(screen.getByText(/Unlock your access/s).textContent).toMatch('Unlock your access to all course activities, including graded assignments');
    expect(screen.getByText(/to course content and materials/s).textContent).toMatch('Full access to course content and materials, even after the course ends');
    expect(screen.getByText(/Support our.*?at edX/s).textContent).toMatch('Support our non-profit mission at edX');
    expect(screen.getByRole('link', { name: 'Upgrade for $149' })).toBeInTheDocument();
  });

  it('renders discount less than an hour properly', async () => {
    const accessExpirationDate = new Date(dateNow);
    accessExpirationDate.setDate(accessExpirationDate.getDate() + 21);
    const discountExpirationDate = new Date(dateNow);
    discountExpirationDate.setMinutes(discountExpirationDate.getMinutes() + 30);
    buildAndRender({
      accessExpiration: {
        expirationDate: accessExpirationDate.toString(),
      },
      contentTypeGatingEnabled: true,
      offer: {
        expirationDate: discountExpirationDate.toString(),
        percentage: 15,
        code: 'Welcome15',
        discountedPrice: '$126.65',
        originalPrice: '$149',
        upgradeUrl: 'www.exampleUpgradeUrl.com',
      },
    });
    expect(screen.getByRole('heading', { name: '15% First-Time Learner Discount' })).toBeInTheDocument();
    expect(screen.getByText('Less than 1 hour left')).toBeInTheDocument();
    expect(screen.getByText(/Earn a.*?of completion to showcase on your resume/s).textContent).toMatch('Earn a verified certificate of completion to showcase on your resume');
    expect(screen.getByText(/Unlock your access/s).textContent).toMatch('Unlock your access to all course activities, including graded assignments');
    expect(screen.getByText(/to course content and materials/s).textContent).toMatch('Full access to course content and materials, even after the course ends');
    expect(screen.getByText(/Support our.*?at edX/s).textContent).toMatch('Support our non-profit mission at edX');
    expect(screen.getByText(/Upgrade for/).textContent).toMatch('$126.65 ($149)');
    expect(screen.getByText(/Use code.*?at checkout/s).textContent).toMatch('Use code Welcome15 at checkout');
  });

  it('renders discount less than a day properly', async () => {
    const accessExpirationDate = new Date(dateNow);
    accessExpirationDate.setDate(accessExpirationDate.getDate() + 21);
    const discountExpirationDate = new Date(dateNow);
    discountExpirationDate.setHours(discountExpirationDate.getHours() + 12);
    buildAndRender({
      accessExpiration: {
        expirationDate: accessExpirationDate.toString(),
      },
      contentTypeGatingEnabled: true,
      offer: {
        expirationDate: discountExpirationDate.toString(),
        percentage: 15,
        code: 'Welcome15',
        discountedPrice: '$126.65',
        originalPrice: '$149',
        upgradeUrl: 'www.exampleUpgradeUrl.com',
      },
    });
    expect(screen.getByRole('heading', { name: '15% First-Time Learner Discount' })).toBeInTheDocument();
    expect(screen.getByText(/hours left/s).textContent).toMatch('12 hours left');
    expect(screen.getByText(/Earn a.*?of completion to showcase on your resume/s).textContent).toMatch('Earn a verified certificate of completion to showcase on your resume');
    expect(screen.getByText(/Unlock your access/s).textContent).toMatch('Unlock your access to all course activities, including graded assignments');
    expect(screen.getByText(/to course content and materials/s).textContent).toMatch('Full access to course content and materials, even after the course ends');
    expect(screen.getByText(/Support our.*?at edX/s).textContent).toMatch('Support our non-profit mission at edX');
    expect(screen.getByText(/Upgrade for/).textContent).toMatch('$126.65 ($149)');
    expect(screen.getByText(/Use code.*?at checkout/s).textContent).toMatch('Use code Welcome15 at checkout');
  });

  it('renders discount less a week properly', async () => {
    const accessExpirationDate = new Date(dateNow);
    accessExpirationDate.setDate(accessExpirationDate.getDate() + 21);
    const discountExpirationDate = new Date(dateNow);
    discountExpirationDate.setDate(discountExpirationDate.getDate() + 6);
    buildAndRender({
      accessExpiration: {
        expirationDate: accessExpirationDate.toString(),
      },
      contentTypeGatingEnabled: true,
      offer: {
        expirationDate: discountExpirationDate.toString(),
        percentage: 15,
        code: 'Welcome15',
        discountedPrice: '$126.65',
        originalPrice: '$149',
        upgradeUrl: 'www.exampleUpgradeUrl.com',
      },
    });
    expect(screen.getByRole('heading', { name: '15% First-Time Learner Discount' })).toBeInTheDocument();
    expect(screen.getByText(/days left/s).textContent).toMatch('6 days left');
    expect(screen.getByText(/Earn a.*?of completion to showcase on your resume/s).textContent).toMatch('Earn a verified certificate of completion to showcase on your resume');
    expect(screen.getByText(/Unlock your access/s).textContent).toMatch('Unlock your access to all course activities, including graded assignments');
    expect(screen.getByText(/to course content and materials/s).textContent).toMatch('Full access to course content and materials, even after the course ends');
    expect(screen.getByText(/Support our.*?at edX/s).textContent).toMatch('Support our non-profit mission at edX');
    expect(screen.getByText(/Upgrade for/).textContent).toMatch('$126.65 ($149)');
    expect(screen.getByText(/Use code.*?at checkout/s).textContent).toMatch('Use code Welcome15 at checkout');
  });

  it('renders discount less a week access expiration less than a week properly', async () => {
    const accessExpirationDate = new Date(dateNow);
    accessExpirationDate.setDate(accessExpirationDate.getDate() + 5);
    const discountExpirationDate = new Date(dateNow);
    discountExpirationDate.setDate(discountExpirationDate.getDate() + 6);
    buildAndRender({
      accessExpiration: {
        expirationDate: accessExpirationDate.toString(),
      },
      contentTypeGatingEnabled: true,
      offer: {
        expirationDate: discountExpirationDate.toString(),
        percentage: 15,
        code: 'Welcome15',
        discountedPrice: '$126.65',
        originalPrice: '$149',
        upgradeUrl: 'www.exampleUpgradeUrl.com',
      },
    });
    expect(screen.getByRole('heading', { name: 'Course Access Expiration' })).toBeInTheDocument();
    expect(screen.getByText('5 days left')).toBeInTheDocument(); // setting the time to 12 will mean that it's slightly less than 12
    expect(screen.getByText(/You will lose all access to this course.*?on/s).textContent).toMatch('You will lose all access to this course, including any progress, on April 18.');
    expect(screen.getByText(/Upgrading your course enables you/s).textContent).toMatch('Upgrading your course enables you to pursue a verified certificate and unlocks numerous features. Learn more about the benefits of upgrading.');
    expect(screen.getByText(/Upgrade for/).textContent).toMatch('$126.65 ($149)');
    expect(screen.getByText(/Use code.*?at checkout/s).textContent).toMatch('Use code Welcome15 at checkout');
  });
});
