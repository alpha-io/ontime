import { MaybeNumber, MessageState, Playback, TimerMessage, TimerPhase, TimerType, ViewSettings } from 'ontime-types';

import { getFormattedTimer } from '../../features/viewers/common/viewUtils';

export function getShowMessage(message: TimerMessage): boolean {
  return message.text !== '' && message.visible;
}

export function getIsPlaying(playback: Playback): boolean {
  return playback === Playback.Play || playback === Playback.Roll;
}

export function getTotalTime(duration: MaybeNumber, addedTime: MaybeNumber): number {
  return (duration ?? 0) + (addedTime ?? 0);
}

export function getShowProgressBar(timerType: TimerType) {
  return timerType !== TimerType.None && timerType !== TimerType.Clock;
}

export function getShowClock(timerType: TimerType) {
  return timerType !== TimerType.Clock;
}

export function getEstimatedFontSize(stageTimer: string, hasSecondaryContent: boolean) {
  const stageTimerCharacters = stageTimer.replace('/:/g', '').length;
  let timerFontSize = 89 / (stageTimerCharacters - 1);
  // we need to shrink the timer if the external is going to be there
  if (hasSecondaryContent) {
    timerFontSize *= 0.8;
  }
  return {
    timerFontSize,
    externalFontSize: timerFontSize * 0.4,
  };
}

export function getShowModifiers(
  timerType: TimerType,
  countToEnd: boolean,
  phase: TimerPhase,
  viewSettings: ViewSettings,
) {
  const showModifiers = timerType === TimerType.CountDown || countToEnd;
  const finished = phase === TimerPhase.Overtime;
  return {
    showEndMessage: showModifiers && finished && viewSettings.endMessage,
    showFinished: showModifiers && finished && (showModifiers || showModifiers), // ????
    showWarning: showModifiers && phase === TimerPhase.Warning,
    showDanger: showModifiers && phase === TimerPhase.Danger,
  };
}

export function getTimerColour(viewSettings: ViewSettings, showWarning: boolean, showDanger: boolean) {
  if (showWarning) return viewSettings.warningColor;
  if (showDanger) return viewSettings.dangerColor;
  return viewSettings.normalColor;
}

export function getSecondaryDisplay(
  message: MessageState,
  currentAux: MaybeNumber,
  localisedMinutes: string,
  removeSeconds: boolean,
  removeLeadingZero: boolean,
): string | undefined {
  if (message.timer.secondarySource === 'aux') {
    return getFormattedTimer(currentAux, TimerType.CountDown, localisedMinutes, {
      removeSeconds,
      removeLeadingZero,
    });
  }
  if (message.timer.secondarySource === 'external' && message.external) {
    return message.external;
  }
  return;
}
