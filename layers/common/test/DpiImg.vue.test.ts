import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DpiImg from '../components/DpiImg.vue';

describe('DpiImg', () => {
  it('renders the correct src and srcset attributes', () => {
    const props = {
      alt: 'Sample image',
      srcset: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
    };

    const wrapper = mount(DpiImg, {
      props,
    });

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);

    expect(img.attributes('src')).toBe('image1.jpg');

    const expectedSrcset = 'image1.jpg 1x, image2.jpg 2x, image3.jpg 3x';
    expect(img.attributes('srcset')).toBe(expectedSrcset);

    expect(img.attributes('alt')).toBe(props.alt);
  });

  it('renders with default alt when none is provided', () => {
    const props = {
      srcset: ['image1.jpg', 'image2.jpg'],
    };

    const wrapper = mount(DpiImg, {
      props,
    });

    const img = wrapper.find('img');

    expect(img.attributes('alt')).toBe(undefined);
  });
});
