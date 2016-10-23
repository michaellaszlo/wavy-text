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
        coefficient: 1.5
      },
      layout = {
        width: 830,
        height: 250,
        amplitudeFactor: 1/4,
        text: {
          gapFactor: 1/6,
          value: 'savor  the  delightful  flavor  of  fizzy cola'
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
        text = layout.text,
        yScale;
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
        //console.log(box.char, x, y, Math.cos(x / 45));
        context.fillStyle = colors.text;
        if (text.warp) {
          context.save();
          context.translate(x, layout.yZero + y);
          yScale = Math.abs(y / layout.amplitude);
          xScale = (yScale + 3) / 4;
          context.scale(xScale, 1.2*(2 - yScale));
          context.fillText(box.char, (1 - xScale)*box.width, 0);
          context.restore();
          // To scale inter-character spacing according to xScale:
          //  x += xScale * box.width;
          x += box.width;
        } else {
          context.fillText(box.char, x, layout.yZero + y);
          x += box.width;
        }
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
      state.lapTime = Date.now();
      animate();
    }
  }

  function toggleWarp() {
    if (layout.text.warp) {
      layout.text.warp = false;
      buttons.warp.innerHTML = '&nbsp;enable warp';
    } else {
      layout.text.warp = true;
      buttons.warp.innerHTML = 'disable warp';
    }
    paint();
  }

  function invertColors() {
    colors.background = buttons.invert.style.color = colors[inversion.state];
    inversion.state = inversion[inversion.state];
    colors.text = buttons.invert.style.background = colors[inversion.state];
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
    // Calculate character widths and total text width.
    context.font = "32px 'Droid Sans Mono', monospace";
    textWidth = 0;
    characterBoxes = layout.text.value.split('').map(function (char) {
      var width = context.measureText(char).width;
      if (char == ' ') {
        width *= 2/3;
      }
      textWidth += width;
      return { char: char, width: width };
    });
    // Set layout parameters.
    layout.text.width = textWidth;
    layout.text.span = (1 + layout.text.gapFactor) * textWidth;
    layout.yZero = layout.height / 2,
    layout.amplitude = layout.amplitudeFactor * layout.height;
    M.makeUnselectable(document.body);
    M.makeUnselectable(canvas);
    [ 'button', 'separator' ].forEach(function (className) {
      elements = document.getElementsByClassName(className);
      for (i = 0; i < elements.length; ++i) {
        M.makeUnselectable(elements[i]);
      }
    });
    buttons.warp = document.getElementById('warpButton');
    buttons.warp.onclick = toggleWarp;
    layout.text.warp = false;
    toggleWarp();
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
    buttons.invert.onclick = invertColors;
    inversion.state = 'pale';
    invertColors();
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
