/// @ 0.13.2
////////////////////////////
// にゃんぷっぷーサークル
//
// 2023.07.28 作成
//
// 無許可コピーしてどうぞ。
////////////////////////////
//https://misskey.io/play/9hp83rqpjf
//とのことなのでパクパクした

//参考play：okazさん作のささつづハシスロット(待機画面部分)https://voskey.icalo.net/play/9pe1uha08x
//         白緑さん(メンテナンスフリー化)https://voskey.icalo.net/notes/aaqpfn5dn9

let PLAY_NAME = "音ﾞ割ﾞれﾞサﾞーﾞクﾞルﾞ"

let TITLE = "　"

let loadingUiText = "<center>$[tada.speed=0s $[position.x=1.7 ロ゛ー゛ド゛中゛  $[position.x=-1.7 $[border.style=hidden $[position.x=1 :pity_yukari:]]$[border.style=hidden $[position.x=-1 $[flip :pity_yukari:]]]]]]</center>"
Ui:render([
  Ui:C:mfm({ text: loadingUiText })
])

let pitys = CUSTOM_EMOJIS.map(@(emoji) { emoji.name }).filter(@(name) { name.index_of("pity") != -1 })
let EMOJIS = pitys.map(@(emoji) { `:{emoji}:` })
EMOJIS.push(':otoware_chifuyu_potter:')

let POS_DATA = [
  [
    {x: 0 y: 0.52}
    {x: 0 y: 0}
    {x: 0 y: 0.52}
  ]
  [
    {x: -2.48 y: 0}
    {x: 2.48 y: 0}
  ]
  [
    {x: -3 y: 0}
    {x: 3 y: 0}
  ]
  [
    {x: -2.48 y: 0}
    {x: 2.48 y: 0}
  ]
  [
    {x: 0 y: -0.52}
    {x: 0 y: 0}
    {x: 0 y: -0.52}
  ]
]

let random = Math:gen_rng(`{USER_ID}{Date:year()}{Date:month()}{Date:day()}{Date:hour()}{Date:minute()}{Date:second()}`)

@getRandomEmojis() {
  var emojis = []
  
  each (let emoji, EMOJIS) {
    emojis.push([emoji `{random(0 1000)}`])
  }
  
  emojis = emojis.sort(@(a b){Str:lt(a[1] b[1])})
  
  if (emojis.len == 0) emojis = [[":blank:" ""]]
  
  return emojis
}

@genMfmText() {
  var mfmText = ""
  
  var emojis = getRandomEmojis()
  
  var i = 0
  each (let dataLine, POS_DATA) {
    each (let data, dataLine){
      
      var otowaretext = `$[border.style=hidden $[position.x=1 {emojis[i][0]}]]$[border.style=hidden $[position.x=-1 $[flip {emojis[i][0]}]]]`
      mfmText = `{mfmText}$[position.x={data.x},y={data.y} $[spin.left,speed=3s $[jelly {otowaretext}]]]`
      
      i += 1
      
      if (i >= emojis.len) i = 0
    }
    mfmText = `{mfmText}{Str:lf}`
  }
  
  mfmText = `$[position.y=2 $[spin.speed=3s {mfmText.trim()}]]`
  
  var centerEmoji = [emojis.pop()]
  //var centerotowaretext = `$[border.style=hidden $[position.x=1 {centerEmoji[0]}]]$[border.style=hidden $[position.x=-1 $[flip {centerEmoji[0]}]]]`
  var centerotowaretext = `$[border.style=hidden $[position.x=1 {centerEmoji[0][0]}]]$[border.style=hidden $[position.x=-1 $[flip {centerEmoji[0][0]}]]]`
  
  mfmText = `{mfmText}{Str:lf}$[position.y=-5 $[x2 $[shake.speed=5s {centerotowaretext}]]]`
  
  return mfmText
}

@update() {
  var mfmText = genMfmText()
  
  var postText = [
    "<center>"
    `{mfmText}`
    `#{PLAY_NAME} {THIS_URL}`
    "</center>"
  ].join(Str:lf)
  
  Ui:get("mfm").update({text: mfmText})
  Ui:get("post").update({form: {text: postText}})
}

Ui:render([
  Ui:C:container({
    align: "center"
    children: [
      Ui:C:mfm({text: ""} "mfm")
    ]
  })
  Ui:C:container({
    align: "center"
    children: [
      Ui:C:postFormButton({
        text: "投稿する"
        primary: true
        rounded: true
      } "post")
    ]
  } "postArea")
])
update()
