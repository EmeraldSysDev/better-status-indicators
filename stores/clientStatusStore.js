/**
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this plugin in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade the plugin to
 * newer versions in the future. If you wish to customize the plugin for
 * your needs please document your changes and make backups before you update.
 *
 *
 * @copyright Copyright (c) 2020-2021 GriefMoDz
 * @license   OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @link      https://github.com/GriefMoDz/better-status-indicators
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { Flux, FluxDispatcher, getModule } = require('powercord/webpack');
let currentClientStatus = {};

const authStore = getModule([ 'initialize', 'getFingerprint' ], false);

function handleInitialClientStatus (sessions) {
  if (Object.keys(currentClientStatus) === 0) {
    currentClientStatus = Object.assign({}, ...sessions.map(session => ({ [session.clientInfo.client]: session.status })));
  }
}

function handleCurrentClientStatus (userId, clientStatus) {
  if (userId === authStore.getId() && clientStatus !== null) {
    currentClientStatus = clientStatus;
  }
}

class ClientStatusStore extends Flux.Store {
  getCurrentClientStatus () {
    return currentClientStatus;
  }
}

module.exports = new ClientStatusStore(FluxDispatcher, {
  SESSIONS_REPLACE: ({ sessions }) => handleInitialClientStatus(sessions),
  PRESENCE_UPDATE: ({ user, clientStatus }) => handleCurrentClientStatus(user.id, clientStatus)
});
