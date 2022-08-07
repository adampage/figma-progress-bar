const { widget } = figma
const { AutoLayout, SVG, Text, Rectangle, Input, useSyncedState, usePropertyMenu } = widget

const initShowEditUI = false
const initCount = 0
const minTarget = 1
const initTarget = 5
const widthWidget = 240
const paddingWidget = 20
const heightProgressBar = 24
const heightSurplusBar = heightProgressBar - 4
const fontSizeTarget = 12
const fontSizeSurplus = 10
const paddingHorizontalTarget = 8
const paddingHorizontalSurplus = 6
const widthTargetEmoji = fontSizeTarget
const widthTargetSpace = fontSizeTarget * (1 / 5)
const widthTargetDigit = fontSizeTarget * (3 / 4)
const widthSurplusSpace = fontSizeSurplus * (1 / 5)
const widthSurplusDigit = fontSizeSurplus * (3 / 4)

const optionsColorProgressBar = [
  { option: "#5963FF", tooltip: "Blue" },
  { option: "#1B26BB", tooltip: "Dark Blue" },
  { option: "#905BA4", tooltip: "Lavender" },
  { option: "#EB6100", tooltip: "Orange" },
  { option: "#8AAF3E", tooltip: "Green" },
  { option: "#FF545E", tooltip: "Red" },
  { option: "#CA9000", tooltip: "Gold" },
  { option: "#444444", tooltip: "Charcoal" }
]

const optionsMetTargetEmoji = [
  { option: "👍", label: "👍" },
  { option: "✅", label: "✅" },
  { option: "🥳", label: "🥳" },
  { option: "🎉", label: "🎉" },
  { option: "🚀", label: "🚀" },
  { option: "⭐️", label: "⭐️" },
  { option: "🏅", label: "🏅" },
  { option: "😎", label: "😎" }
]

const colorProgressBarDefault = optionsColorProgressBar[0].option
const metTargetEmojiDefault = optionsMetTargetEmoji[0].option

function ProgressBar() {
  const [showEditUI, toggleEditUI] = useSyncedState("showEditUI", initShowEditUI)
  const [colorProgressBar, setColorProgressBar] = useSyncedState("colorProgressBar", colorProgressBarDefault)
  const [metTargetEmoji, setMetTargetEmoji] = useSyncedState("metTargetEmoji", metTargetEmojiDefault)
  const [numCount, setCount] = useSyncedState("count", initCount)
  const [numTarget, setTarget] = useSyncedState("target", initTarget)
  const numSurplus = Math.max(0, numCount - numTarget)
  const metTarget = numCount >= numTarget
  const propertyMenu: WidgetPropertyMenuItem[] = []

  propertyMenu.push({
    tooltip: 'Show / hide UI',
    propertyName: 'toggleEditUI',
    itemType: 'action'
  })

  propertyMenu.push({
    tooltip: 'Target - 1',
    propertyName: 'decTarget',
    itemType: 'action',
  })

  propertyMenu.push({
    tooltip: 'Target + 1',
    propertyName: 'incTarget',
    itemType: 'action',
  })

  propertyMenu.push({
    itemType: 'separator',
  })

  propertyMenu.push({
    itemType: 'color-selector',
    propertyName: 'colorProgressBar',
    tooltip: 'Progress bar color',
    selectedOption: colorProgressBar,
    options: optionsColorProgressBar
  })

  propertyMenu.push({
    itemType: 'dropdown',
    propertyName: 'metTargetEmoji',
    tooltip: 'Emoji when target met',
    selectedOption: metTargetEmoji,
    options: optionsMetTargetEmoji
  })

  propertyMenu.push({
    tooltip: 'Reset',
    propertyName: 'reset',
    itemType: 'action',
  })

  usePropertyMenu(propertyMenu, ({ propertyName, propertyValue }) => {
    if (propertyName === 'colorProgressBar' && propertyValue) {
      setColorProgressBar(propertyValue)
    } else if (propertyName === 'metTargetEmoji' && propertyValue) {
      setMetTargetEmoji(propertyValue)
    } else if (propertyName === 'incTarget') {
      setTarget(numTarget + 1)
    } else if (propertyName === 'decTarget' && numTarget > minTarget) {
      setTarget(numTarget - 1)
    } else if (propertyName === 'toggleEditUI') {
      toggleEditUI(!showEditUI)
    } else if (propertyName === 'reset') {
      setCount(initCount)
      setTarget(initTarget)
      toggleEditUI(initShowEditUI)
    }
  })

  // Caluclate progress and overflow widths
  const widthAvailableSpace = widthWidget - (paddingWidget * 2)
  const widthProgressSpace = !numSurplus ? widthAvailableSpace : (numTarget / numCount) * widthAvailableSpace
  const widthProgressBar = (numCount / numTarget) * widthProgressSpace
  const widthOverflowArea = Math.max(0.01, widthAvailableSpace - widthProgressSpace)
  const widthSurplusArea = Math.max(0.01, widthOverflowArea - 1)

  // Prepare text summaries and determine layout triggers
  const textProgress = metTarget ? `${metTargetEmoji} ${numTarget}` : `${Math.min(numCount, numTarget)} of ${numTarget}`
  const textSurplus = numSurplus ? `+ ${numSurplus}` : ``
  const numDigitsTarget = numTarget.toString().length
  const numDigitsSurplus = numSurplus.toString().length
  const widthTextTarget = (paddingHorizontalTarget * 2) + widthTargetEmoji + widthTargetSpace + (numDigitsTarget * widthTargetDigit)
  const widthTextSurplus = (paddingHorizontalSurplus * 2) + widthSurplusDigit + widthSurplusSpace + (numDigitsSurplus * widthSurplusDigit)
  const targetCanFitText = widthProgressSpace > widthTextTarget
  const overflowCanFitText = widthOverflowArea > widthTextSurplus

  return (
    <AutoLayout
      name="Widget"
      direction="vertical"
      width={widthWidget}
      padding={{ horizontal: 0, vertical: paddingWidget }}
      spacing={10}
    >
      <AutoLayout
        name="UI"
        hidden={!showEditUI}
        width="fill-parent"
        padding={{ horizontal: paddingWidget, vertical: 0 }}
      >
        <AutoLayout
          name="Form"
          direction="horizontal"
          width="fill-parent"
          fill="#eee"
          padding={8}
          spacing={4}
          stroke={{ r: 0, g: 0, b: 0, a: 0.25 }}
          strokeWidth={1}
          strokeAlign="inside"
          cornerRadius={2}
        >
          <AutoLayout
            name="Input / Count"
            direction="vertical"
            spacing={4}
          >
            <Text
              name="Label"
              fontSize={8}
              fontWeight={900}
              fill="#000"
            >
              Count
            </Text>
            <Input
              value={numCount.toString()}
              placeholder="Integer"
              onTextEditEnd={(e) => {
                let newCount = parseInt(e.characters)
                if (!newCount || newCount < initCount) {
                  newCount = initCount
                }
                setCount(newCount);
              }}
              fontSize={10}
              fill="#000"
              width={40}
              inputFrameProps={{
                fill: "#fff",
                stroke: "#333",
                cornerRadius: 1,
                padding: 4,
              }}
              inputBehavior="truncate"
            />
          </AutoLayout>
          <AutoLayout
            name="]-["
            padding={{ top: 18, left: 0, bottom: 0, right: 0 }}
          >
            <Text
              fontSize={10}
              fontWeight={400}
              fill="#000"
            >
              of
            </Text>
          </AutoLayout>
          <AutoLayout
            name="Input / Target"
            direction="vertical"
            spacing={4}
          >
            <Text
              name="Label"
              fontSize={8}
              fontWeight={900}
              fill="#000"
            >
              Target
            </Text>
            <Input
              value={numTarget.toString()}
              placeholder="Integer"
              onTextEditEnd={(e) => {
                let newTarget = parseInt(e.characters)
                if (!newTarget || newTarget < initTarget) {
                  newTarget = initTarget
                }
                setTarget(newTarget);
              }}
              fontSize={10}
              fill="#000"
              width={40}
              inputFrameProps={{
                fill: "#fff",
                stroke: "#333",
                cornerRadius: 1,
                padding: 4,
              }}
              inputBehavior="truncate"
            />
          </AutoLayout>
          <AutoLayout
            name="]-["
            padding={{ top: 18, left: 0, bottom: 0, right: 0 }}
          >
            <Text
              fontSize={10}
              fontWeight={400}
              fill="#000"
            >
              = {(numCount / numTarget * 100).toFixed(2)}%
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout
        name="Bar"
        direction="vertical"
        width={widthWidget}
      >
        <AutoLayout
          name="]-["
          direction="horizontal"
          width="fill-parent"
          padding={{ horizontal: paddingWidget, vertical: 0 }}
        >
          <AutoLayout
            name="Available space"
            direction="horizontal"
            verticalAlignItems="center"
            width="fill-parent"
          >
            <AutoLayout
              name="Target space"
              width={widthProgressSpace}
              height={heightProgressBar}
              fill="#fff"
              stroke={{ r: 0, g: 0, b: 0, a: 0.75 }}
              strokeWidth={1}
              strokeAlign="inside"
              cornerRadius={2}
            >
              <AutoLayout
                name="Progress space"
                positioning="absolute"
                x={0}
                y={0}
                width={widthProgressSpace}
                height={heightProgressBar}
              >
                <AutoLayout
                  name="]-["
                  verticalAlignItems="center"
                  height="fill-parent"
                  padding={{ horizontal: paddingHorizontalTarget, vertical: 0 }}
                >
                  <Text
                    name="Progress text / Dark"
                    fontSize={fontSizeTarget}
                    fontWeight={900}
                    fill={{ r: 0, g: 0, b: 0, a: 0.75 }}
                  >
                    {textProgress}
                  </Text>
                </AutoLayout>
              </AutoLayout>
              <AutoLayout
                name="Progress bar"
                hidden={!numCount}
                positioning="absolute"
                x={0}
                y={0}
                width={widthProgressBar || 0.01}
                height={heightProgressBar}
                fill={numCount < numTarget ? colorProgressBar : colorProgressBar}
              >
                <AutoLayout
                  name="]-["
                  verticalAlignItems="center"
                  width={widthProgressBar || 0.01}
                  height="fill-parent"
                  padding={{ horizontal: paddingHorizontalTarget, vertical: 0 }}
                  fill={metTarget ? { r: 0, g: 0, b: 0, a: 0.32 } : { r: 0, g: 0, b: 0, a: 0 }}
                >
                  <Text
                    name="Progress text / Light"
                    hidden={!targetCanFitText}
                    fontSize={fontSizeTarget}
                    fontWeight={900}
                    fill="#fff"
                  >
                    {textProgress}
                  </Text>
                </AutoLayout>
              </AutoLayout>
            </AutoLayout>
            <AutoLayout
              name="Overflow space"
              hidden={!numSurplus}
              width={widthOverflowArea}
              height={heightSurplusBar}
            >
              <AutoLayout
                name="Surplus space"
                positioning="absolute"
                x={1}
                y={0}
                width={widthSurplusArea}
                height={heightSurplusBar}
              >
                <AutoLayout
                  name="]-["
                  verticalAlignItems="center"
                  height="fill-parent"
                  padding={{ horizontal: paddingHorizontalSurplus, vertical: 0 }}
                >
                </AutoLayout>
              </AutoLayout>
              <AutoLayout
                name="Surplus bar"
                positioning="absolute"
                x={1}
                y={0}
                width={widthSurplusArea}
                height={heightSurplusBar}
                fill={numCount < numTarget ? colorProgressBar : colorProgressBar}
                stroke={{ r: 0, g: 0, b: 0, a: 0.2 }}
                strokeWidth={1}
                strokeAlign="inside"
                cornerRadius={{ topRight: 2, bottomRight: 2 }}
              >
              </AutoLayout>
            </AutoLayout>
            <AutoLayout
              name="Surplus text"
              positioning="absolute"
              horizontalAlignItems={overflowCanFitText ? "start" : "end"}
              verticalAlignItems="center"
              x={overflowCanFitText ? widthProgressSpace : 0}
              y={0}
              width={overflowCanFitText ? widthOverflowArea : widthProgressSpace}
              height={heightProgressBar}
              padding={overflowCanFitText ? { horizontal: paddingHorizontalSurplus } : { horizontal: paddingHorizontalTarget }}
            >
              <Text
                name="Progress text / Light"
                hidden={targetCanFitText}
                fontSize={fontSizeTarget}
                fontWeight={900}
                fill="#fff"
              >
                {textProgress}
              </Text>
              <Text
                name="Surplus text / Light"
                fontSize={fontSizeSurplus}
                fontWeight={700}
                fill="#fff"
              >
                {textSurplus}
              </Text>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
        <AutoLayout
          name="Button / Decrement"
          tooltip="Reduce progress by 1"
          positioning="absolute"
          x={0}
          y={0}
          width={widthWidget / 2}
          height={heightProgressBar}
          verticalAlignItems="center"
          opacity={0.25}
          hoverStyle={{
            opacity: 1
          }}
          onClick={() => {
            if (numCount > initCount) {
              setCount(numCount - 1)
            }
          }}
        >
          <Text
            width={paddingWidget}
            horizontalAlignText="center"
            fontSize={12}
            fontWeight={900}
            fill="#000"
          >
            ◀
          </Text>
        </AutoLayout>
        <AutoLayout
          name="Button / Increment"
          tooltip="Increase progress by 1"
          positioning="absolute"
          x={widthWidget / 2}
          y={0}
          width={widthWidget / 2}
          height={heightProgressBar}
          verticalAlignItems="center"
          horizontalAlignItems="end"
          opacity={0.25}
          hoverStyle={{
            opacity: 1
          }}
          onClick={() => {
            setCount(numCount + 1)
          }}
        >
          <Text
            width={paddingWidget}
            horizontalAlignText="center"
            fontSize={12}
            fontWeight={900}
            fill="#000"
          >
            ▶
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  )
}

widget.register(ProgressBar)
