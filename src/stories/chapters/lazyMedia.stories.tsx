import { Card, PageTitle, Spacer } from '../common/themeComponent';
import LazyIframe from '../common/Iframe';
import LazyIframeFunctional from '../common/IframeFunctional';
import LazyImage from '../common/Image';
import LazyImageFunctional from '../common/ImageFunctional';

export default {
  title: 'Lazy Media',
  component: Card,
  decorators: [
    (Story: React.ElementType) => (
      <>
        <PageTitle />
        <Spacer />
        <div style={{ padding: '20px', maxWidth: '400px' }}>
          <Story />
        </div>
      </>
    ),
  ],
};

export function ClassComponentLazyloadImage() {
  const imageArray = [
    {
      src: 'https://s-media-cache-ak0.pinimg.com/originals/cf/31/83/cf31837a53dc1cdb13880ac38c66d70d.jpg',
      ratio: '508/397',
    },
    {
      src: 'http://cdn1-www.dogtime.com/assets/uploads/gallery/english-bulldog-puppies/english-bulldog-9.jpg',
      ratio: '1',
    },
    {
      src: 'https://i2-prod.mirror.co.uk/incoming/article4482806.ece/ALTERNATES/s615/PAY-Stolen-Lilac-Puppy.jpg',
      ratio: '615/409',
    },
  ];
  return (
    <Card
      titleText="Lazyload Image"
      contentNode={imageArray.map((image) => (
        <LazyImage key={image.src} src={image.src} ratio={image.ratio} />
      ))}
    />
  );
}

export function ClassComponentLazyloadIframe() {
  const iframeArray = [
    {
      src: 'https://www.youtube.com/embed/hTcBnxxuAls',
      ratio: '560/315',
    },
    {
      src: 'https://www.youtube.com/embed/M8AlxrwhY30',
      ratio: '560/315',
    },
    {
      src: 'https://www.youtube.com/embed/q31tGyBJhRY',
      ratio: '560/315',
    },
  ];
  return (
    <Card
      titleText="Lazyload Iframe"
      contentNode={iframeArray.map((iframe) => (
        <LazyIframe key={iframe.src} src={iframe.src} ratio={iframe.ratio} />
      ))}
    />
  );
}

export function FunctionalComponentLazyloadImage() {
  const imageArray = [
    {
      src: 'https://s-media-cache-ak0.pinimg.com/originals/cf/31/83/cf31837a53dc1cdb13880ac38c66d70d.jpg',
      ratio: '508/397',
    },
    {
      src: 'http://cdn1-www.dogtime.com/assets/uploads/gallery/english-bulldog-puppies/english-bulldog-9.jpg',
      ratio: '1',
    },
    {
      src: 'https://i2-prod.mirror.co.uk/incoming/article4482806.ece/ALTERNATES/s615/PAY-Stolen-Lilac-Puppy.jpg',
      ratio: '615/409',
    },
  ];
  return (
    <Card
      titleText="Lazyload Image"
      contentNode={imageArray.map((image) => (
        <LazyImageFunctional
          key={image.src}
          src={image.src}
          ratio={image.ratio}
        />
      ))}
    />
  );
}

export function FunctionalComponentLazyloadIframe() {
  const iframeArray = [
    {
      src: 'https://www.youtube.com/embed/hTcBnxxuAls',
      ratio: '560/315',
    },
    {
      src: 'https://www.youtube.com/embed/M8AlxrwhY30',
      ratio: '560/315',
    },
    {
      src: 'https://www.youtube.com/embed/q31tGyBJhRY',
      ratio: '560/315',
    },
  ];
  return (
    <Card
      titleText="Lazyload Iframe"
      contentNode={iframeArray.map((iframe) => (
        <LazyIframeFunctional
          key={iframe.src}
          src={iframe.src}
          ratio={iframe.ratio}
        />
      ))}
    />
  );
}
