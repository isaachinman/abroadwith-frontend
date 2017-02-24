# Images

This project uses webpack in a relatively conservative way - only for the management of css/scss and JavaScript. Using webpack to manage images is not a good idea.

### Methodology

Images are stored in S3 buckets, one for integration, one for production.

In integration, images can be accessed either directly at their S3 urls, or via a simple cloudfront distribution.

In production, we use an extremely nice service called [imgix](https://imgix.com/). The basis of this service is an SSD-based CDN which is unbelievably fast. They also have an extensive [query param API](https://docs.imgix.com/apis/url) which allows you to do editing as complex as facial recognition crops, completely on the fly via query params.

In terms of optimisation, I recommend [tinypng](https://tinypng.com/) in general.

We have a highly-optimised image pipeline in our production environment, so it is important to follow these steps:

1. Optimise, probably lossy, every single image you want to put on the website.

2. Never, ever, use an image which is bigger than you need. Via imgix, this can be controlled with query params: `?w=500` - this would crop the image to 500 pixels in width. You can use this in conjunction with media queries to have literally the easiest responsive image setup imaginable:

  ```
  .thing {
    background-image: url('//abroadwith.imgix.net/photo');
    @media (max-width: 1000px) {
      background-image: url('//abroadwith.imgix.net/photo?w=1000');
    }
    @media (max-width: 500px) {
      background-image: url('//abroadwith.imgix.net/photo?w=500');
    }
  }
  ```

This is of high importance, as approximately half the bandwidth transmitted from this project is images.
