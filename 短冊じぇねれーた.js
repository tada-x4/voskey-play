/// @ 0.13.3
// licenced under MPL-2.0
// （改変やコピーの際はソースコードの明示とオリジナルURLを貼ってください）
//
// Thanks MFM idea @secineralyr
// https://misskey.io/notes/9gvcq02ln6
// 以下のソースコードを丸々借りました
// 短冊じぇねれーた by @taichan@misskey.io
// https://misskey.io/play/9gvdil3d8f

var line1 = "ぼ民が"
var line2 = "　服を着ますように"
var bg = "cf4"
var fg = "000"

@rotate(str) {
  if (['ー'].incl(str)) {
    return `$[rotate.deg=0 {str}]`
  }
  return `$[rotate.deg=-90 {str}]`
}

@color(txt) {
  if (txt == '') return 'f00'
  return txt
}

@convert_line(line) {
  var strs = []
  var inEmoji = false
  var emojiTmp = ''
  for let i, line.len {
    if (!inEmoji) {
    if (line.pick(i) != ':') {
      strs.push(line.pick(i))
    } else {
      inEmoji = true
      emojiTmp = ':'
    }
    } else {
      emojiTmp = `{emojiTmp}{line.pick(i)}`
      if (line.pick(i) == ':') {
        inEmoji = false
        strs.push(`$[scale.x=0.5,y=0.5 {emojiTmp}]`)
        emojiTmp = ''
      }
    }
  }
  loop {
    if (strs.len >= 9) break
    strs.push('　')
  }
  return strs.map(@(text){ rotate(text) }).join()
}

@create_text() {
  return `$[position.y=-1 $[scale.x=1.1 $[rotate.deg=30 $[scale.x=0.75,y=0.6 $[rotate.deg=-45 $[position.x=1.5,y=9 $[rotate $[scale.x=2 $[blur $[scale.x=5,y=3 $[bg.color={color(bg)}a :blank:]]]]]]$[position.x=-.5,y=9 $[rotate $[scale.x=2 $[scale.x=5,y=3 $[bg.color={color(bg)} :blank:]]]]]$[position.x=-3.4,y=-2.2 $[rotate.deg=-30 $[scale.x=0.5,y=3 $[rotate.deg=50 :_0:]]]]$[position.x=-4 $[scale.x=0.5,y=0.5 ⚪]]
$[position.x=-6.48,y=5.59 $[font.serif $[fg.color={color(fg)} $[x2 $[rotate.deg=90 {convert_line(line1)}
{convert_line(line2)}]]]]]]]]]]




:blank:
#おねがいごと
{THIS_URL}
`
}

@update() {
  Ui:get('preview').update({ text: create_text() })
  Ui:get('postForm').update({ form: { text: create_text() } })
}

Ui:render([
  Ui:C:textInput({
    onInput: @(text){
      line1 = text
      update()
    }
    default: line1
    label: "１行目"
    caption: '9文字より入れると崩れます'
  })
  Ui:C:textInput({
    onInput: @(text){
      line2 = text
      update()
    }
    default: line2
    label: "２行目"
    caption: '9文字より入れると崩れます'
  })
  Ui:C:folder({
    title: '色指定（オプション）'
    opened: true
    children: [
      Ui:C:textInput({
        onInput: @(text){
          bg = text
          update()
        }
        default: bg
        label: "背景色指定"
        caption: '3桁RGB方式で入力してください'
      })
      Ui:C:textInput({
        onInput: @(text){
          fg = text
          update()
        }
        default: fg
        label: "文字色指定"
        caption: '3桁RGB方式で入力してください'
      })
    ]
  })

  Ui:C:mfm({
    text: `<small>プレビュー{Str:lf}</small>`
  })
  Ui:C:mfm({
    text: `{Str:lf}`
  })
	Ui:C:mfm({
		text: create_text(),
	}, 'preview')
	Ui:C:postFormButton({
		text: "星におねがいする"
    primary: true
    form: { text: create_text() }
	}, 'postForm')
])