var WavyText = (function () {
  var running,
      lapTime,
      canvas,
      context,
      characterBoxes,
      buttons = {},
      inversion = {
        dark: 'pale',
        pale: 'dark'
      },
      colors = {
        dark: '#082445',
        pale: '#ebecde'
      },
      dimensions = {
        width: 750,
        height: 300
      },
      speed = 2,
      text = 'Savor  the  delightful  flavor  of  Bubba-Cola';

  function animate() {
    var currentTime = Date.now(),
        elapsed = (currentTime - lapTime) / 15;
    lapTime = currentTime;
    paint(elapsed);
    if (running) {
      requestAnimationFrame(animate);
    }
  }

  function paint(elapsed) {
    var yZero = dimensions.height / 2,
        amplitude = dimensions.height/4,
    elapsed = elapsed || 0;
    context.fillStyle = colors.background;
    context.fillRect(0, 0, dimensions.width, dimensions.height);
    characterBoxes.forEach(function (box) {
      box.pos -= elapsed * speed;  // Update char position.
      if (box.pos < -box.width) {
        box.pos += dimensions.width + 50;  // Wrap around from left to right.
      }
      var y = Math.sin(box.pos / 45) * amplitude;
      context.fillStyle = colors.text;
      context.fillText(box.char, box.pos, dimensions.height/2 + y);
    });
  }

  function startAnimation() {
    running = true;
    lapTime = Date.now();
    animate();
  }

  function pause() {
    if (running) {
      running = false;
      buttons.pause.innerHTML = 'resume';
    } else {
      running = true;
      buttons.pause.innerHTML = 'pause';
      startAnimation();
    }
  }

  function invert() {
    colors.background = invertButton.style.color = colors[inversion.state];
    inversion.state = inversion[inversion.state];
    colors.text = invertButton.style.background = colors[inversion.state];
    paint();
  }

  function multiplySpeed(factor) {
    speed *= factor;
    formatted = '' + Math.floor(speed * 100) / 100;
    if (formatted.indexOf('.') == -1) {
      formatted += '.00';
    } else if (formatted.indexOf('.') == formatted.length - 2) {
      formatted += '0';
    }
    document.getElementById('speedDisplay').innerHTML = formatted;
  }

  function load() {
    var elements,
        i,
        pos;
    canvas = document.getElementsByTagName('canvas')[0];
    context = canvas.getContext('2d');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    // Calculate the pixel offset of each character in the text.
    context.font = "32px 'Droid Sans Mono', monospace";
    pos = canvas.width;
    characterBoxes = text.split('').map(function (char) {
      var width = context.measureText(char).width,
          box = { char: char, width: width, pos: pos };
      pos += width;
      return box;
    });
    M.makeUnselectable(document.body);
    M.makeUnselectable(canvas);
    [ 'button', 'separator' ].forEach(function (className) {
      elements = document.getElementsByClassName(className);
      for (i = 0; i < elements.length; ++i) {
        M.makeUnselectable(elements[i]);
      }
    });
    buttons.pause = document.getElementById('pauseButton');
    buttons.pause.onclick = canvas.onclick = pause;
    multiplySpeed(1);
    document.getElementById('fasterButton').onclick = function () {
      multiplySpeed(1.05);
    };
    document.getElementById('slowerButton').onclick = function () {
      multiplySpeed(1 / 1.05);
    };
    buttons.invert = document.getElementById('invertButton');
    buttons.invert.onclick = invert;
    inversion.state = 'pale';
    invert();
    startAnimation();
  }

  return {
    load: load
  };
}());

WebFont.load({
  google: {
    families: ['Source Sans Pro']
  },
  active: WavyText.load
});
