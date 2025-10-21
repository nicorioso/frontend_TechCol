import { images } from '../assets/img/img_url.jsx';

export function getImageById(id) {
    return images[id] || null;
}