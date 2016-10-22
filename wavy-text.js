var WavyText = (function () {
  var running,
      lapTime,
      canvas,
      context,
      characterBoxes,
      colors = {
        dark: '#082445',
        pale: '#ebecde'
      },
      dimensions = {
        width: 750,
        height: 300
      },
      text = 'Savor  the  delightful  flavor  of  Bubba-Cola';

  function animate() {
    var yZero = dimensions.height / 2,
        amplitude = dimensions.height/4,
        currentTime = Date.now(),
        elapsed = (currentTime - lapTime) / 15;
    lapTime = currentTime;
    context.fillStyle = colors.background;
    context.fillRect(0, 0, dimensions.width, dimensions.height);
    characterBoxes.forEach(function (box) {
      box.pos -= elapsed;  // Update char position.
      if (box.pos < -box.width) {
        box.pos += dimensions.width + 50;  // Wrap around from left to right.
      }
      var y = Math.sin(box.pos / 45) * amplitude;
      context.fillStyle = colors.text;
      context.fillText(box.char, box.pos, dimensions.height/2 + y);
    });
    if (running) {
      requestAnimationFrame(animate);
    }
  }

  function startAnimation() {
    running = true;
    lapTime = Date.now();
    animate();
  }

  function load() {
    var pos;
    canvas = document.getElementsByTagName('canvas')[0];
    context = canvas.getContext('2d');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    // Calculate the pixel offset of each character in the text.
    context.font = "32px 'Source Sans Pro', monospace";
    pos = canvas.width;
    characterBoxes = text.split('').map(function (char) {
      var width = context.measureText(char).width,
          box = { char: char, width: width, pos: pos };
      pos += width;
      return box;
    });
    document.getElementById('pauseButton').onclick = function () {
      if (running) {
        running = false;
        this.innerHTML = 'resume';
      } else {
        running = true;
        this.innerHTML = 'pause';
        startAnimation();
      }
    };
    colors.background = colors.pale;
    colors.text = colors.dark;
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
