import 'react-aspect-ratio/aspect-ratio.css';
import '../theme.css';

if (typeof window !== 'undefined') {
  // Polyfills for intersection-observer
  require('intersection-observer'); // eslint-disable-line
}
