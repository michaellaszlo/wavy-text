var WavyText = (function () {
  var canvas,
      context,
      characterBoxes,
      buttons = {},
      state = {
        running: false,
        lapTime: null,
        leftEdge: null
      },
      inversion = {
        dark: 'pale',
        pale: 'dark'
      },
      colors = {
        dark: '#082445',
        pale: '#ebecde'
      },
      speed = {
        // Speed calculation: value = coefficient * factor^exponent, with
        //  exponent initialized to 0. The user clicks buttons to increment
        //  or decrement exponent by 1.
        factor: 1.1,
        coefficient: 2
      },
      layout = {
        width: 750,
        height: 300,
        text: {
          gap: 0.2,
          value: 'Savor  the  delightful  flavor  of  Bubba-Cola'
        }
      };

  function animate() {
    var currentTime = Date.now(),
        elapsed = (currentTime - state.lapTime) / 15;
    state.lapTime = currentTime;
    paint(elapsed);
    if (state.running) {
      requestAnimationFrame(animate);
    }
  }

  function paint(elapsed) {
    var xStart, span, x, y, i, box,
        text = layout.text;
    elapsed = elapsed || 0;
    context.fillStyle = colors.background;
    context.fillRect(0, 0, layout.width, layout.height);
    state.leftEdge -= elapsed * speed.value;
    while (state.leftEdge + text.width <= 0) {
      state.leftEdge += text.span;
    }
    for (xStart = state.leftEdge; xStart < layout.width; xStart += text.span) {
      x = xStart;
      for (i = 0; i < characterBoxes.length; ++i) {
        box = characterBoxes[i];
        y = Math.sin(x / 45) * layout.amplitude;
        context.fillStyle = colors.text;
        context.fillText(box.char, x, layout.yZero + y);
        x += box.width;
      }
    }
  }

  function startAnimation() {
    state.running = true;
    state.lapTime = Date.now();
    state.leftEdge = 0;
    animate();
  }

  function pause() {
    if (state.running) {
      state.running = false;
      buttons.pause.innerHTML = 'resume';
    } else {
      state.running = true;
      buttons.pause.innerHTML = 'freeze';
      startAnimation();
    }
  }

  function invert() {
    colors.background = invertButton.style.color = colors[inversion.state];
    inversion.state = inversion[inversion.state];
    colors.text = invertButton.style.background = colors[inversion.state];
    paint();
  }

  function modifySpeed(increment) {
    speed.exponent += increment;
    speed.value = speed.coefficient * Math.pow(speed.factor, speed.exponent);
    formatted = '' + Math.floor(speed.value * 100) / 100;
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
        textWidth;
    canvas = document.getElementsByTagName('canvas')[0];
    context = canvas.getContext('2d');
    canvas.width = layout.width;
    canvas.height = layout.height;
    // Calculate the pixel offset of each character in the text.
    context.font = "32px 'Droid Sans Mono', monospace";
    textWidth = 0;
    characterBoxes = layout.text.value.split('').map(function (char) {
      var width = context.measureText(char).width,
          box = { char: char, width: width };
      textWidth += width;
      return box;
    });
    layout.text.width = textWidth;
    layout.text.span = (1 + layout.text.gap) * textWidth;
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
    speed.exponent = 0;
    modifySpeed(0);
    document.getElementById('fasterButton').onclick = function () {
      modifySpeed(1);
    };
    document.getElementById('slowerButton').onclick = function () {
      modifySpeed(-1);
    };
    buttons.invert = document.getElementById('invertButton');
    buttons.invert.onclick = invert;
    inversion.state = 'pale';
    invert();
    layout.yZero = layout.height / 2,
    layout.amplitude = layout.height / 4;
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
