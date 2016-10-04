(function() {
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[data-duration]'))
  var totalDuration = 0
  sections.forEach(function (section) {
    section.priorDuration = totalDuration
    console.log(section, section.priorDuration)
    section.duration = parseDuration(section.getAttribute('data-duration'))
    totalDuration += section.duration
  })

  console.log('TOTAL DURATION:', formatDuration(totalDuration))

  var extraSeconds = parseDuration('40:00') - totalDuration

  Reveal.addEventListener('slidechanged', handleSlideChange)

  document.addEventListener('keypress', handleKeyPress)

  var gStartTime = Date.now()

  function formatDuration (secs) {
    var comps = []
    while (secs > 0) {
      var comp = secs % 60
      comps.unshift(comp < 10 ? '0' + comp : String(comp))
      secs = Math.floor(secs / 60)
    }
    while (comps.length < 2) {
      comps.unshift('00')
    }
    return comps.join(':')
  }

  function handleKeyPress (e) {
    if (e.keyCode === 114 || e.keyCode === 82) { // r/R
      gStartTime = Date.now()
    }
  }

  function handleSlideChange (e) {
    if (e.indexh === 1) {
      // First slide change: go
      gStartTime = Date.now()
    }

    if (e.currentSlide.priorDuration != null) {
      notifyDuration(e.currentSlide)
    }
  }

  function notifyDuration (slide) {
    var expectedPriorDuration = slide.priorDuration
    var actualPriorDuration = Math.round((Date.now() - gStartTime) / 1000)
    var backgroundColor = 'green', foregroundColor = 'white'
    var percentage = expectedPriorDuration > 0 ? Math.round(actualPriorDuration * 100 / expectedPriorDuration) : '///'
    if (actualPriorDuration > expectedPriorDuration) {
      if (actualPriorDuration - expectedPriorDuration > extraSeconds) {
        backgroundColor = 'red'
      } else if (percentage > 120) {
        backgroundColor = 'orange'
      } else {
        backgroundColor = 'yellow'
        foregroundColor = 'black'
      }
    }
    console.log(
      '%c%s (%s%% of %s)',
      'background-color: ' + backgroundColor + '; color: ' + foregroundColor + '; font-size: 2em',
      formatDuration(actualPriorDuration),
      percentage,
      formatDuration(expectedPriorDuration)
    )
  }

  function parseDuration (text) {
    return text.trim().split(':').reduce(function(acc, n) {
      return acc * 60 + (Number(n) || 0)
    }, 0)
  }
})()
