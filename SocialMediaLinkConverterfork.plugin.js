/**
 * @name SocialMediaLinkConverterfork
 * @forked from RoyRiv3r/SocialMediaLinkConverter.plugin.js
 * @author SakurajimaMai-1202
 * @description Changes Twitter, TikTok, Bsky, Threads, Reddit ,twitch and Instagram pixiv links to their respective modified formats for proper embedding when shared on Discord.
 * @source https://github.com/SakurajimaMai-1202/SocialMediaLinkConverter.plugin.js
 * @updateURL  https://raw.githubusercontent.com/SakurajimaMai-1202/SocialMediaLinkConverter.plugin.js/main/SocialMediaLinkConverter.plugin.js
 * @version 0.10.0
 */

/**
 * @name SocialMediaLinkConverterfork
 * @author SakurajimaMai-1202
 * @description Changes Twitter, TikTok, Bsky, Threads, Reddit and Instagram pixiv links to their respective modified formats for proper embedding when shared on Discord.
 * @donate https://ko-fi.com/royriver
 * @source https://github.com/SakurajimaMai-1202/SocialMediaLinkConverter.plugin.js
 * @updateURL https://raw.githubusercontent.com/SakurajimaMai-1202/SocialMediaLinkConverter.plugin.js/main/SocialMediaLinkConverter.plugin.js
 * @version 0.10.0
 */

class SocialMediaLinkConverterfork {
  constructor() {
    this.settings = {
      convertTwitter: true,
      convertTikTok: true,
      convertInstagram: true,
      convertBsky: true,
      convertThreads: true,
      convertReddit: true,
      convertPixiv: true,
      converttwitch: true,
    };

    this.conversionRules = [
      {
        id: "convertTwitter",
        regex: /https:\/\/(twitter\.com|x\.com)\//g,
        replacement: "https://fxtwitter.com/",
      },
      {
        id: "convertTikTok",
        regex: /https:\/\/www\.tiktok\.com\//g,
        replacement: "https://www.tnktok.com/",
      },
      {
        id: "convertInstagram",
        regex: /https:\/\/www\.instagram\.com\//g,
        replacement: "https://www.instagramez.com/",
      },
      {
        id: "convertBsky",
        regex: /https:\/\/bsky\.app\//g,
        replacement: "https://bsyy.app/",
      },
      {
        id: "convertThreads",
        regex: /https:\/\/(www\.)?threads\.net\//g,
        replacement: "https://www.vxthreads.net/",
      },
      {
        id: "convertReddit",
        regex: /https:\/\/(www\.|new\.)?reddit\.com\//g,
        replacement: "https://www.rxddit.com/",
      },
      {
       id: "convertPixiv",
       regex: /https:\/\/www\.pixiv\.net\/artworks\/(\d+)/,
       replacement: "https://www.phixiv.net/artworks/$1",
     },
     {
      id: "convertTikTokVT",
      regex: /https:\/\/vt\.tiktok\.com\//g,
      replacement: "https://vt.tnktok.com/",
     },
     {
      id: "convertTikTokVM",
      regex: /https:\/\/vm\.tiktok\.com\//g,
      replacement: "https://vm.tnktok.com/",
     },
      {
        id: 'Twitch',
        regex: /https?:\/\/(?:clips\.twitch\.tv|(?:www\.)?twitch\.tv\/\w+\/clip)\//g,
         replacement: 'https://clips.fxtwitch.tv/',
      },

    ];

    this.defaultConfig = this.conversionRules.map((rule) => ({
      type: "switch",
      id: rule.id,
      note: `Convert ${rule.id.replace("convert", "")} links from original to ${
        rule.replacement.match(/https?:\/\/(www\.)?([^\/]+)/)[2]
      } format`,
      value: true,
    }));
  }

  load() {
    this.settings =
      BdApi.loadData("SocialMediaLinkConverter", "settings") || this.settings;
  }

  start() {
    this.patchSendMessage();
    this.patchUploadFiles();
  }

  stop() {
    BdApi.Patcher.unpatchAll("SocialMediaLinkConverter");
  }

  patchSendMessage() {
    const MessageActions = BdApi.findModuleByProps("sendMessage");
    BdApi.Patcher.before(
      "SocialMediaLinkConverter",
      MessageActions,
      "sendMessage",
      (_, args) => {
        let [channelId, message, messageId] = args;
        this.conversionRules.forEach((rule) => {
          if (this.settings[rule.id]) {
            message.content = message.content.replace(
              rule.regex,
              rule.replacement
            );
          }
        });
        args[1] = message;
      }
    );
  }

  patchUploadFiles() {
    const MessageActions = BdApi.findModuleByProps("uploadFiles");
    BdApi.Patcher.before(
      "SocialMediaLinkConverter",
      MessageActions,
      "uploadFiles",
      (_, props) => {
        if (props[0].parsedMessage && props[0].parsedMessage.content) {
          this.conversionRules.forEach((rule) => {
            if (this.settings[rule.id]) {
              props[0].parsedMessage.content =
                props[0].parsedMessage.content.replace(
                  rule.regex,
                  rule.replacement
                );
            }
          });
        }
      }
    );
  }

  getSettingsPanel() {
    const panel = document.createElement("div");
    this.defaultConfig.forEach((setting, index) => {
      if (setting.type === "switch") {
        const switchElement = this.createToggle(
          setting.id.replace("convert", ""),
          setting.note,
          this.settings[setting.id],
          (checked) => {
            this.settings[setting.id] = checked;
            BdApi.saveData(
              "SocialMediaLinkConverter",
              "settings",
              this.settings
            );
          }
        );
        panel.appendChild(switchElement);
        switchElement.querySelector(".toggle-note").style.color = "#FFFFFF";
        if (index < this.defaultConfig.length - 1) {
          const separator = document.createElement("hr");
          separator.style.margin = "10px 0";
          panel.appendChild(separator);
        }
      }
    });
    return panel;
  }

  createToggle(name, note, isChecked, onChange) {
    const toggleContainer = document.createElement("div");
    toggleContainer.className = "toggle-container";
    const toggleNote = document.createElement("div");
    toggleNote.className = "toggle-note";
    toggleNote.textContent = note;
    toggleContainer.appendChild(toggleNote);
    const toggleLabel = document.createElement("label");
    toggleLabel.className = "toggle";
    toggleContainer.appendChild(toggleLabel);
    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.checked = isChecked;
    toggleInput.onchange = (e) => onChange(e.target.checked);
    toggleLabel.appendChild(toggleInput);
    const toggleSlider = document.createElement("span");
    toggleSlider.className = "slider round";
    toggleLabel.appendChild(toggleSlider);
    const toggleName = document.createElement("span");
    toggleName.className = "toggle-name";
    toggleName.textContent = name;
    toggleContainer.appendChild(toggleName);
    return toggleContainer;
  }
}
