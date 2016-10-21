var WavyText = (function () {
  var canvasWidth = 750,
      canvasHeight = 300,
      text = 'Savor  the  delightful  flavor  of  Bubba-Cola';

  function start() {
    var canvas = document.getElementsByTagName('canvas')[0],
        context = canvas.getContext('2d'),
        yZero = canvasHeight / 2,           // Set axis position and amplitude
        amplitude = canvasHeight * 1 / 4,  // according to canvas dimensions.
        textColor ='#fff',
        backgroundColor = '#000';
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.font = "32px 'Source Sans Pro', monospace";

    var pos = canvasWidth;  // Split the text into characters.
    var units = text.split('').map(function (char) {
      var width = context.measureText(char).width,
          unit = { char: char, width: width, pos: pos };
      pos += width;  // Calculate the pixel offset of each character.
      return unit;
    });

    var running = true,
        lapTime;  // Set this before the first animation call.

    function animate() {
      var currentTime = Date.now(),  // Calculate pixel position of the char.
          dp = (currentTime - lapTime) / 15;
      lapTime = currentTime;
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvasWidth, canvasHeight);
      units.forEach(function (unit) {
        unit.pos -= dp;  // Update char position.
        if (unit.pos < -unit.width) {
          unit.pos += canvasWidth + 50;  // Wrap around from left to right.
        }
        var y = Math.sin(unit.pos / 45) * amplitude;
        context.fillStyle = textColor;
        context.fillText(unit.char, unit.pos, yZero + y);
      });
      if (running) {
        requestAnimationFrame(animate);
      }
    }

    document.getElementById('pauseButton').onclick = function () {
      if (running) {
        running = false;
        this.innerHTML = 'resume';
      } else {
        running = true;
        this.innerHTML = 'pause';
        requestAnimationFrame(animate);
      }
    };

    lapTime = Date.now();
    requestAnimationFrame(animate);
  }

  return {
    start: start
  };
}());

WebFont.load({
  google: {
    families: ['Source Sans Pro']
  },
  active: WavyText.start
});
