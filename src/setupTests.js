// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

if (typeof window !== 'undefined') {
  // Polyfills for intersection-observer
  require('intersection-observer'); // eslint-disable-line
}
