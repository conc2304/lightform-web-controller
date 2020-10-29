import './index-f06469e8.js';
import { A as ActiveRouter } from './active-router-218481f8.js';
import './match-path-760e1797.js';
import './location-utils-fea12957.js';

function injectHistory(Component) {
    ActiveRouter.injectProps(Component, ['history', 'location']);
}
