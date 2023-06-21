// -----JS CODE-----
//@input SceneObject cloud
/** @type {SceneObject} */
var cloud = script.cloud;
//@input SceneObject camera
/** @type {SceneObject} */
var camera = script.camera;

//@input float startDelay = 5.0 {"widget":"slider", "min":0.0, "max":10.0, "step":0.1}
/** @type {number} */
var startDelay = script.startDelay;
//@input float followSpeed = 0.5 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
/** @type {number} */
var followSpeed = script.followSpeed;
//@input float lookAtSpeed = 0.1 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
/** @type {number} */
var lookAtSpeed = script.lookAtSpeed;
//@input float followDistance = 30.0 
/** @type {number} */
var followDistance = script.followDistance;
//@input float followHeight = 10
/** @type {number} */
var followHeight = script.followHeight;

let canFollow = false;

var event = script.createEvent("DelayedCallbackEvent");
event.bind(function (eventData) {
  canFollow = true;
});
event.reset(startDelay);

script.createEvent("UpdateEvent").bind(function (eventData) {
  if (!canFollow) return;

  smoothFollow(cloud, camera, followDistance, followHeight, followSpeed, lookAtSpeed);
})


// a smooth follow function to be used in an update loop that makes a follower follow a target
// the follower lerps towards a point in front of the target 
// the follower looks towards the target
function smoothFollow(follower, target, distance, height, smoothTime, lookAtSpeed) {
  var targetPos = target.getTransform().getWorldPosition();
  var followerPos = follower.getTransform().getWorldPosition();
  var targetRot = target.getTransform().getWorldRotation();
  var followerRot = follower.getTransform().getWorldRotation();

  var targetForward = target.getTransform().forward;
  var targetUp = target.getTransform().up;

  var targetPosOffset = targetForward.mult(new vec3(-distance - 200, -distance, -distance));
  targetPosOffset = targetPosOffset.add(targetUp.mult(new vec3(0, height, 0)))//vec3.add(targetPosOffset, targetUp.mult(new vec3(0, height, 0)));

  var targetPosWithOffset = targetPos.add(targetPosOffset);

  var newPos = vec3.lerp(followerPos, targetPosWithOffset, smoothTime);
  follower.getTransform().setWorldPosition(newPos);

  var newRot = quat.slerp(followerRot, targetRot, lookAtSpeed);
  follower.getTransform().setWorldRotation(newRot);
}



/**
* Returns the number between `a` and `b` determined by the ratio `t`
* @param {number} a Lower Bound
* @param {number} b Upper Bound
* @param {number} t Ratio [0-1]
* @returns {number} Number between `a` and `b` determined by ratio `t`
*/
function lerp(a, b, t) {
  return a + (b - a) * t;
}

