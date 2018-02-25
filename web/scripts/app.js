
  var socket = io.connect('/');

  const MAX_LINES = 1000;

  $(document).ready(function() {
      socket.emit("client-ready");
  });
  
  $(document).on("click", "#side-bar>.clients input.client", function() {
      if ($(this).is(":checked")) {
          socket.emit("start-client", {
              id: $(this).attr("name"),
          });
          $("." + $(this).attr("name") + "-loggers-list").find(".logger").removeProp('disabled');
      } else {
          $(".line[data-client=" + $(this).attr("name") + "]").remove();
          $("." + $(this).attr("name") + "-loggers-list").find(".logger").prop('disabled', true);
          socket.emit("stop-client", {
              id: $(this).attr("name"),
          });
      }
  });
  
  $(document).on("click", "#side-bar>.clients .loggers-list input.logger", function() {
      if ($(this).is(":checked")) {
          socket.emit("start-logger", {
              id: $(this).attr("name"),
          });
      } else {
          $(".line[data-logger=" + $(this).attr("name") + "]").remove();
          socket.emit("stop-logger", {
              id: $(this).attr("name"),
          });
      }
  });

  socket.on("server-info", function(serverInfo){
      serverInfo.clients.forEach((client) => {
          const clientId = client.client_id;
          if ($("#side-bar").find(".client[id=chk-client-" + clientId + "]").length == 0) {
              $("#side-bar>.clients").append($("<input>", {
                  "type": "checkbox",
                  "checked": true,
                  "text": clientId,
                  "class": "client",
                  "id": "chk-client-" + clientId,
                  "name": clientId,
              }));
              $("#side-bar>.clients").append($("<label>", {
                  "for": "chk-client-" + clientId,
                  "text": clientId,
                  "class": "client-label",
              }));
              $("#side-bar>.clients").append("<div class='" + clientId + "-loggers-list loggers-list'></div>");
              $("#side-bar>.clients").append("<br/>");
          }
          client.loggers.forEach((loggerId) => {
              if ($("." + clientId + "-loggers-list").find(".logger[id=chk-logger-" + loggerId + "]").length == 0) {
                  $("." + clientId + "-loggers-list").append($("<input>", {
                      "type": "checkbox",
                      "checked": true,
                      "text": loggerId,
                      "class": "logger",
                      "id": "chk-logger-" + loggerId,
                      "name": loggerId,
                  }));

                  $("." + clientId + "-loggers-list").append($("<label>", {
                      "for": "chk-logger-" + loggerId,
                      "text": loggerId,
                      "class": "logger-label",
                  }));
                  $("." + clientId + "-loggers-list").append("<br/>");
              }
          });
      });
  });
  
  socket.on("data", function(inp){
      const data = inp.data;
      const loggerId = data.logger_id || data.channel_name;
      const clientId = data.client_id || data.channel_name;

      const classes = ['line', `evt-${data.event_type}`];

      if (!$("#chk-logger-" + loggerId).is(":checked")) {
          classes.push('hidden-logger');
      }

      if (!$("#chk-client-" + clientId).is(":checked")) {
          classes.push('hidden-client');
      }

      if (inp.log_type) {
          classes.push(`log-${inp.log_type}`);
      }

      const newLine = $("<div>", {
          "text": data.line,
          "class": classes.join(' ' ),
          "data-logger": loggerId,
          "data-client": clientId,
      });
      $("#lines").append(newLine);
      
      if ($("#follow").is(":checked")) {
          newLine[0].scrollIntoView(false);
      }

      const lineCount = $(".line").length;
      if (lineCount > MAX_LINES) {
        $(".line:not(:nth-child(n+" + (lineCount - MAX_LINES) + "))").remove(); // remove old logs
      }
  });
