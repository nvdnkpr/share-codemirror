(function () {
  'use strict';

  function shareCodeMirrorCursor(cm, ds) {
    cm.on('cursorActivity', function (doc) {
      var startCur = doc.getCursor('start');
      //var endCur = doc.getCursor('end');

      var from = startCur;
      var to = {line: startCur.line, ch: startCur.ch + 1};

      if (ds) {
        ds.send({_type: 'cursor', from: from, to: to});
      }
    });

    if (ds) {
      var marker;
      // DispatchSocket message
      ds.on_cursor = function (msg) {
        if (marker) marker.clear();
        // TODO: can't display it at end of line. Might need to use from==to and style marker?
        var opts = {inclusiveLeft: true, inclusiveRight: true, className: 'otherPerson'};
        marker = cm.markText(msg.from, msg.to, opts);
      };
    }
  }

  // Exporting
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // Node.js
    module.exports = shareCodeMirrorCursor;
    module.exports.scriptsDir = __dirname;
  } else {
    if (typeof define === 'function' && define.amd) {
      // AMD
      define([], function () {
        return shareCodeMirrorCursor;
      });
    } else {
      // Browser, no AMD
      window.shareCodeMirrorCursor = shareCodeMirrorCursor;
    }
  }

})();
