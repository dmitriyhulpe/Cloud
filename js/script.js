const Texts = [
    'Html', 'Css', 'JavaScript',
    'Gulp', 'Mongoose', 'React',
    'Bootstrap', 'Sass', 'Angular',
    'Express', 'NodeJS', 'MongoDB'
];

const tagCloud = TagCloud('.container', Texts, {

    radius: 150,

    maxSpeed: 'fast',
    initSpeed: 'fast',

    direction: 135,

    keep: true

});

const color = '#282C34 ';
document.querySelector('.container').style.color = color;