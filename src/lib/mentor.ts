/**
 * Public Lumira mentor animation API.
 *
 * @example
 * const { setMentorState } = useMentorAnimationState();
 * setMentorState("thinking");
 */
export {
  MentorAnimationProvider,
  useMentorAnimationState,
  useMentorAnimationStateOptional,
  deriveMentorAnimState,
  type MentorAnimState,
} from "./mentor-animation-context";
