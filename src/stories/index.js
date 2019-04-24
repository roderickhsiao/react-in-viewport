import 'react-aspect-ratio/aspect-ratio.css';
import '../../theme.css';

// chapters
import './chapters/enterCallback';
import './chapters/lazyMedia';
import './chapters/transition';

if (typeof window !== 'undefined') {
  // Polyfills for intersection-observer
  require('intersection-observer'); // eslint-disable-line
}
