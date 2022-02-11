
//
// QDB version 4.1
//
// Unless required by applicable law or agreed to in writing, software distributed under the
// License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific language governing permissions
// and limitations under the License.
//

module.exports = {

    // QDB
    Connection: require("./Sources/Connection"),
    Schema:     require("./Sources/Schema"),

    // Generics
    Generics: require("./Sources/Generics"),

    // Enumerations
    Journal:          require("./Sources/Enumerations/Journal"),
    JoinStrategy:     require("./Sources/Enumerations/JoinStrategy"),
    CacheStrategy:    require("./Sources/Enumerations/CacheStrategy"),
    Synchronisation:  require("./Sources/Enumerations/Synchronisation"),
    SortingPredicate: require("./Sources/Enumerations/SortingPredicate")

};
