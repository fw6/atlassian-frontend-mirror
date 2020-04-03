const mockReactDom = {
  ...jest.requireActual('react-dom'),
  unmountComponentAtNode: () => {},
};
jest.mock('react-dom', () => mockReactDom);

import React from 'react';
import { mount } from 'enzyme';
import {
  PortalProvider,
  PortalRenderer,
  PortalProviderAPI,
} from '../../../ui/PortalProvider';

const Component = () => <div className="component">My component</div>;

describe('PortalProvider', () => {
  let portalProviderAPI: PortalProviderAPI;
  let wrapper: any;
  let place: HTMLElement;
  let place2: HTMLElement;
  let handleAnalyticsEvent: any;

  const initPortalProvider = () => {
    handleAnalyticsEvent = jest.fn();
    wrapper = mount(
      <PortalProvider
        onAnalyticsEvent={handleAnalyticsEvent}
        render={api => {
          portalProviderAPI = api;
          return <PortalRenderer portalProviderAPI={api} />;
        }}
      />,
    );

    portalProviderAPI!.render(Component, place);
    wrapper.update();
  };

  beforeEach(() => {
    place = document.body.appendChild(document.createElement('div'));
    place.classList.add('place');
    place2 = document.body.appendChild(document.createElement('div'));
    place2.classList.add('place2');
    initPortalProvider();
  });

  afterEach(() => {
    place.parentNode!.removeChild(place);
    place2.parentNode!.removeChild(place2);
  });

  it.skip('should render a component successfully', () => {
    expect(wrapper.find(Component).length).toBe(1);
  });

  it.skip('should render several components successfully', () => {
    portalProviderAPI!.render(Component, place2);
    wrapper.update();
    expect(wrapper.find(Component).length).toBe(2);
  });

  it.skip('should destroy a component successfully', () => {
    portalProviderAPI!.remove(place);
    wrapper.update();

    expect(wrapper.find(Component).length).toBe(0);
  });

  describe('React throws an error while unmounting child component', () => {
    const error = new Error('Something happened...');

    beforeEach(() => {
      mockReactDom.unmountComponentAtNode = () => {
        throw error;
      };
    });

    afterEach(() => {
      mockReactDom.unmountComponentAtNode = () => {};
    });

    it('should not throw error', () => {
      expect(() => portalProviderAPI!.remove(place)).not.toThrowError();
    });

    it('should fire analytics if React throws an error when unmounting', () => {
      portalProviderAPI!.remove(place);

      expect(handleAnalyticsEvent).toHaveBeenCalledWith({
        payload: {
          action: 'failedToUnmount',
          actionSubject: 'editor',
          actionSubjectId: 'reactNodeView',
          attributes: {
            error,
            domNodes: { container: 'place', child: 'component' },
          },
          eventType: 'operational',
        },
      });
    });
  });
});
