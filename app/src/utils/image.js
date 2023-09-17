import ImageUrlBuilder from '@sanity/image-url';
import client from './client';

function urlForThumbnail(source) {
    return ImageUrlBuilder(client).image(source).width(300).url();
}

function getImageUrl(source) {
    return ImageUrlBuilder(client).image(source).width(580).url();
}

function urlForCart(source) {
    return ImageUrlBuilder(client).image(source).width(50).height(50).url();
}

export { urlForThumbnail, getImageUrl, urlForCart };
