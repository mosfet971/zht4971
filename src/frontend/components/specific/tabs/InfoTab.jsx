import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import MenuCard from "../../universal/MenuCard.jsx";
import { modalWindowsManagerStore } from "../../../stores/ModalWindowsManagerStore.js";
import { noteTabStore } from "../../../stores/tabsStores/NoteTabStore.js";
import { tabsManagerStore } from "../../../stores/TabsManagerStore.js";

import {
    IconFilePlus,
    IconHelp,
    IconLock,
    IconReportAnalytics,
    IconFileSymlink,
    IconRecycle
} from '@tabler/icons-react';



let InfoTextContainer = styled.div`
    letter-spacing: .01em; 
    word-break: normal; 
    max-width: 90%; 
    margin-left: 3em;
    margin-right: 1em;
    margin-top: 1em;
    margin-bottom: 1em;
    font-size: 125%;
`;

let InfoTab = observer(() => {
    return (
        <InfoTextContainer>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam dolores cupiditate quia consequatur nam vero corporis, voluptates sit veniam assumenda beatae ut aperiam laudantium ipsam eius expedita illo quasi quam!
            Aperiam fugit facilis voluptatum sed corporis harum laudantium cumque at quisquam sit dolorum eius explicabo eaque quia labore, suscipit illo perspiciatis, quo itaque est! Ullam laborum fuga delectus sequi recusandae.
            Molestias, eos? Adipisci odit labore quia deserunt commodi veniam? Velit et aperiam voluptatibus, tempora dolore vitae, porro, quam dicta earum impedit quo rem atque. Veniam impedit repellendus ratione sed enim.
            Laborum numquam illum iusto? Reiciendis, magnam sapiente ut aliquid veritatis corporis, harum error animi non numquam facere quia cupiditate quas eum tenetur, illum possimus molestiae voluptatum. Tempore minus quidem ipsa.
            Vitae atque corrupti accusantium porro sit, distinctio labore excepturi quibusdam voluptate tempore hic dolorum ullam dolorem quae, aperiam, deleniti in. Fugiat ut quos magnam, explicabo quo vel voluptas soluta nesciunt.
            Esse natus quas cum libero quia neque? Sit, maiores exercitationem! Laborum amet adipisci, quasi praesentium nam unde nulla, dicta nemo, autem iste voluptatibus neque consequatur mollitia fuga commodi facere cum!
            Sequi obcaecati non quas ducimus at in consequuntur veritatis optio, itaque quisquam impedit possimus magnam modi nisi. Quisquam vitae molestias perspiciatis incidunt minima rerum assumenda doloribus dolorem odio cupiditate. In.
            Repudiandae dolor, ut tempore quisquam aliquam doloremque deserunt expedita perspiciatis odit iure sapiente recusandae quibusdam, placeat dolores. Pariatur laboriosam facilis sapiente excepturi consectetur corrupti et voluptas reprehenderit ad quas. Ad!
            Vitae quam ipsa deleniti porro, nesciunt officia accusantium ratione! Quisquam iure saepe temporibus deleniti quidem exercitationem in, corrupti tempore atque qui reprehenderit culpa eligendi sed, nemo itaque doloremque. Provident, dolorem!
            Autem quibusdam neque saepe hic beatae quia sequi facilis aliquid non reiciendis voluptatum labore odio ad, blanditiis accusamus fugit! Enim id illum, nobis consequuntur ipsum ab eveniet necessitatibus adipisci libero!
            Sint quam dolores qui adipisci perferendis voluptatum, facilis tenetur error. Quos corrupti molestias veniam, deserunt sapiente tenetur accusamus repellat excepturi laudantium rerum quo tempore nobis unde iure inventore, fugit qui!
            Asperiores laborum veniam cum, similique ipsa mollitia eveniet magnam optio voluptatem consectetur ex rem? Ipsam fugiat nostrum et deleniti, modi ab animi quam cum illum reiciendis ducimus ipsa, assumenda illo?
            Alias pariatur molestiae fuga explicabo reprehenderit deleniti dolorem esse magnam, rem eos veniam? Mollitia nobis id aspernatur ipsam! Quaerat laudantium officia sit suscipit in, ipsum id fugit distinctio ab voluptas?
            Aspernatur delectus facilis mollitia accusamus quia itaque iusto repellendus modi quidem fuga. Illo laboriosam commodi est ipsa nihil ea, inventore ad in repellat dicta numquam deleniti laborum soluta sit itaque.
            Perferendis saepe, odio voluptates hic amet nesciunt ipsa necessitatibus sit quasi iusto adipisci aut optio explicabo ratione, doloremque repudiandae accusantium, molestiae rem animi dolorem quam! Illo excepturi consectetur molestias voluptatem.
            Unde minus repudiandae modi. Voluptatibus culpa voluptas dolorem quaerat, obcaecati sunt ipsum molestiae consectetur fugit ea. A beatae eius voluptate ex consequuntur assumenda eveniet quis dolorem tempore. Et, ea. A.
            Et molestias sit beatae est, laboriosam in repellendus corporis eos facere voluptates, deserunt ab delectus explicabo quis temporibus commodi, dolorum accusamus. Natus accusamus cumque, incidunt facere ducimus itaque voluptate suscipit!
            Deserunt accusamus omnis quaerat, error enim iusto excepturi deleniti officia, quo assumenda reiciendis aspernatur commodi corrupti fugit placeat voluptas accusantium molestiae expedita, cum fugiat! Rerum debitis reprehenderit provident ut. Unde.
            Quasi illum voluptates dignissimos neque perspiciatis repellendus ipsum vel itaque iure nulla pariatur rerum mollitia aspernatur laudantium magnam voluptatibus, cupiditate vitae? Exercitationem cumque incidunt dolore minima distinctio, repudiandae magnam ipsum!
            Vero repellat provident, blanditiis at, sapiente quos reiciendis exercitationem perspiciatis, soluta nobis ut. Quas magnam esse minima labore exercitationem neque reiciendis, voluptate doloribus! Illum quis nisi dolor quam accusantium facilis.
            Autem molestias fugiat delectus, optio, dignissimos, obcaecati velit possimus quisquam tenetur ea consequuntur odio quos vitae quaerat doloribus porro suscipit facilis! Molestiae amet maxime deleniti dolores deserunt id. Temporibus, odio?
            Laudantium ipsa, corporis dolorum pariatur incidunt facere ea unde nesciunt harum repellendus numquam, vel in aut quisquam blanditiis nulla ullam sint, autem ut? A illum sunt assumenda at exercitationem corporis.
            Beatae consequuntur vitae porro molestiae magni laudantium nihil qui, ipsum quo? Fuga, exercitationem pariatur nesciunt non laborum quas, fugit sapiente rerum expedita totam sed ipsum est aspernatur libero voluptatem voluptate!
            Qui nisi molestias ab deleniti recusandae labore. Nesciunt provident sit quam eum explicabo delectus doloribus! Non porro saepe hic rerum eaque minima ab, molestiae dignissimos quae corporis maxime assumenda cupiditate.
            Dignissimos quam ipsum hic mollitia, dolore eum impedit magni molestias reprehenderit. Similique provident quia iure labore aliquam ad eligendi illum dignissimos incidunt sunt est rerum velit, perspiciatis laboriosam. Ullam, debitis.
            Quae, libero doloribus quasi veniam accusamus natus, modi illo amet aliquid adipisci laudantium officiis aut sint reiciendis quas ex quaerat repellat accusantium animi id quis alias magni. Iure, dolore eveniet!
            Aperiam iure perferendis rem inventore. Quas sunt assumenda blanditiis fugiat facilis quos obcaecati ullam. Quo molestiae temporibus provident tempora adipisci sunt, mollitia expedita, atque, saepe culpa illo? Rem, aliquam quisquam!
            Ipsa illo rem veritatis natus enim. Praesentium excepturi alias veritatis at quae porro rerum itaque sint a asperiores, aperiam nisi magni placeat cumque. Accusantium magnam totam quia porro molestiae magni.
            Officiis corporis reprehenderit est doloribus unde sed cumque voluptas repellat hic? Ab laborum ad ipsam, alias asperiores reiciendis eum consequatur! Illum, officia eaque. Voluptate facilis autem quos, magni atque voluptates!
            Magni nam explicabo ducimus eius fugiat sit odio enim dolore incidunt? Dicta temporibus odio repellat architecto veniam ullam, mollitia nemo nihil labore impedit voluptatibus pariatur incidunt, animi nulla error distinctio.
            Omnis odio quisquam culpa ea repudiandae id, quae atque rerum adipisci optio perspiciatis tempore vel enim placeat quia! Minima aut earum impedit debitis! Vel reprehenderit corporis illo sint, dolore at.
            Totam exercitationem distinctio illum. Adipisci, officiis. Eius explicabo et suscipit dolorem adipisci sunt natus voluptatem nemo quae rerum assumenda, id, dolores possimus impedit! Eum maxime repellat obcaecati quas voluptatibus ipsa?
            Aperiam nam dolorum distinctio voluptatum vel quisquam fuga unde provident aut accusantium labore iste fugiat consectetur, ratione obcaecati nulla eligendi veniam. Molestiae eveniet maxime error repudiandae placeat atque, harum accusamus?
            Natus quos tempore architecto facere. Inventore explicabo minima asperiores esse ipsam. Alias doloremque, et eum natus ducimus facere incidunt pariatur minima, nobis cum laboriosam eveniet dolore ex asperiores, architecto reiciendis?
            Provident neque quia id odio! Et illo quod inventore cupiditate unde accusantium. Cumque libero repellendus quidem voluptates praesentium culpa, veniam ipsa aliquam minima qui a, consequuntur, nisi natus numquam expedita!
            Cupiditate, omnis culpa! Molestias, aspernatur dolorem ipsum ducimus, voluptatum delectus sapiente officiis eius vero commodi quas dolore porro qui maxime officia. Id amet, voluptate officiis nobis fugiat modi reiciendis atque?
            Non, distinctio tempore incidunt tenetur debitis eligendi vitae quis obcaecati iusto temporibus ad eius modi explicabo! Fugit pariatur provident iusto fugiat, a dolor tempore voluptates fuga qui ea magni debitis.
            Repellendus, iure quae obcaecati voluptatibus aut vitae nesciunt distinctio reiciendis quam perspiciatis beatae rerum quas iste explicabo sunt mollitia totam natus accusantium. Quasi ipsam quas quisquam assumenda nihil? Vel, officia!
            Minus porro illum culpa ipsa laudantium. Ipsam ut, minus sequi facere deserunt nostrum voluptatem dignissimos quasi praesentium repellendus laudantium voluptate esse ipsum error eaque voluptas, beatae nesciunt ad. Quia, qui!
            Assumenda possimus consectetur officiis? Aspernatur esse impedit deserunt vero laudantium natus quas, veniam numquam quo autem obcaecati velit at architecto aut! Itaque dolore amet odit reprehenderit labore nisi dolorum tempore?
            Nesciunt consequatur, similique voluptas eveniet voluptatibus sed temporibus atque nemo, fugit, quibusdam perferendis provident repellendus hic animi cum consectetur quia. Quisquam dolore voluptates inventore mollitia corporis, saepe doloribus labore ipsam!
            Vitae cupiditate autem perferendis, dolore quod maiores voluptates officia? Tempora maiores molestias voluptatibus saepe nihil necessitatibus eveniet, distinctio, excepturi voluptate accusantium repudiandae modi debitis natus molestiae. Velit minus dolorem quia.
            Mollitia ipsam numquam animi consequatur eum et quas, labore natus. Excepturi alias voluptatum explicabo sequi recusandae eum, fugiat, assumenda eveniet voluptatem aliquid eaque deleniti itaque, in magni nam consequuntur molestiae?
            Rerum fugiat corrupti alias? Debitis similique veritatis eligendi obcaecati odit nemo molestias itaque reprehenderit? Quaerat natus perferendis porro adipisci qui, obcaecati laudantium commodi reiciendis ipsum molestias, nesciunt magnam reprehenderit fuga.
            Eveniet reprehenderit, incidunt quod vero assumenda aspernatur in repudiandae earum? Possimus, nemo perferendis dolor ipsum sed consequuntur labore. Optio ab consequatur doloribus rerum explicabo obcaecati quo accusantium alias aut molestiae.
            Reiciendis nobis earum quos, animi possimus numquam, suscipit, molestiae voluptatibus vero porro officia maiores minima necessitatibus sint incidunt soluta repudiandae facilis rerum est fuga quis reprehenderit. Ratione minima placeat reiciendis.
            Harum nostrum commodi atque id distinctio enim consequatur fuga beatae esse voluptatibus aut, eligendi accusamus, magnam reiciendis itaque possimus quasi, est sed. Minus, repudiandae mollitia facilis beatae nobis ea ullam!
            Doloribus suscipit porro illo totam optio, exercitationem laborum corporis pariatur enim perspiciatis aliquam, soluta saepe error iure ipsa accusamus magnam deleniti corrupti molestiae. Eligendi minima nulla rem vitae id esse.
            Accusantium quaerat et ex harum facere maiores vel labore! Quia nemo placeat architecto minus sapiente unde similique beatae quibusdam commodi! Voluptas minima non nesciunt sunt. Perspiciatis, rerum maiores. Aliquid, laborum?
            Molestias, sunt culpa asperiores, est voluptatem qui voluptate expedita nisi earum cupiditate ipsam quaerat nobis. Distinctio, cum ullam. Obcaecati eligendi ut aliquam odio ipsam facilis dignissimos, quidem dolor iure cupiditate.
            Blanditiis quidem fuga omnis suscipit commodi vitae rerum, temporibus officiis, veritatis nihil mollitia quas! Id sunt autem omnis illo harum doloremque voluptas quas itaque quod eligendi. Corporis fugiat expedita nisi.
            Quasi nesciunt excepturi ipsum voluptate facilis rerum debitis reprehenderit in quam nam et, harum sint inventore error obcaecati laboriosam beatae. Minus reiciendis veritatis optio odio rem debitis dolore totam vitae?
            Explicabo inventore nulla autem sint dolores et reprehenderit, ipsam nobis, quaerat mollitia ex tempora odit molestiae rerum a dolorem, assumenda itaque optio quas soluta. Eius quo dolorem modi ullam repudiandae!
            Accusantium sequi eos laudantium magnam iste maiores rerum quaerat quas suscipit deserunt alias, nulla magni, facilis consectetur voluptatem, natus obcaecati cum debitis cumque eius aut harum? Labore distinctio voluptatum excepturi.
            Quibusdam ipsum esse sed nisi iste voluptatibus, reprehenderit dolor necessitatibus quae perferendis placeat incidunt obcaecati, a autem dicta enim, et illum! Soluta corporis assumenda fuga nostrum? Temporibus unde consequatur fuga.
            Nesciunt, dolore? Adipisci corporis iure deserunt possimus voluptate hic necessitatibus alias fugiat officiis repellendus tempore, quis cupiditate ducimus sapiente perspiciatis placeat eaque, asperiores repellat dignissimos natus recusandae a! Magni, fugit.
            Quod assumenda culpa eaque, repellendus totam, doloribus ipsa ipsum sed provident non illo vel officia ullam voluptatum quae facilis! Reprehenderit animi quam dolorum vero reiciendis dolore odit, commodi sequi nemo?
            Similique nobis eveniet, dolorum corrupti voluptatum dolor dolore placeat adipisci autem vel libero asperiores exercitationem amet nisi dolores laborum dolorem a aliquam nemo esse voluptas, unde aspernatur! Sapiente, eum fuga!
            Provident beatae fuga quos facilis suscipit molestias amet? Modi expedita culpa similique a quis dicta aut voluptas necessitatibus at corrupti impedit officiis nobis tenetur eum delectus, nesciunt cum maxime cupiditate.
            Consectetur quia explicabo porro blanditiis? Reiciendis atque expedita impedit, quisquam soluta vero esse qui incidunt quo odio! Aperiam tenetur blanditiis deleniti dicta eum, officiis corporis iste ex ratione quidem voluptatibus!
            Dolorem qui, minima repudiandae dignissimos iste blanditiis pariatur ut magnam cum officiis culpa amet sint fuga dicta molestiae sit vel at. Natus ipsam harum magnam dolore repellat pariatur rerum quis.
            Consequatur, saepe dolores. Alias ducimus hic est repellat reiciendis saepe! Temporibus aliquam repudiandae maiores, esse explicabo soluta asperiores culpa ut odio excepturi harum doloremque praesentium suscipit! Dolore sunt cumque consectetur.
            Nisi quas iste quisquam natus, esse mollitia magnam, sed blanditiis a autem maiores quam quia. Qui, vel tempora distinctio dignissimos exercitationem impedit. Fugiat labore magnam debitis maiores consectetur excepturi illo!
            Odit aliquid illo quo, libero iusto ex. Deleniti quia magnam, laborum maiores eveniet nam totam, nulla est quod quibusdam praesentium voluptas doloremque nemo voluptates vitae distinctio officiis. Molestiae, ipsa aut!
            Commodi voluptatibus debitis culpa assumenda quis error repudiandae facilis alias, laboriosam doloremque, libero sit. Rem tempore esse iste repudiandae ad doloremque, labore voluptatum illo error, officiis voluptate quod fuga quos?
            Nesciunt, eveniet omnis tenetur minus exercitationem ab odit provident velit cumque maiores debitis aspernatur obcaecati, asperiores iure, quae consequatur soluta libero voluptatibus? Optio adipisci alias quia neque illum nulla nobis!
            Accusamus excepturi eligendi possimus molestiae. Earum quod ex unde est nihil atque animi hic sint explicabo iure vitae corrupti ut quo autem molestias laboriosam, blanditiis rerum quasi nulla laudantium corporis.
            Commodi exercitationem neque maxime amet odio! Dolorum perferendis blanditiis atque accusantium fugit ex praesentium dolores eius? Odio mollitia odit doloremque, recusandae saepe dolorum eius provident architecto ea a magnam dignissimos.
            Totam enim quam eius amet in ad vero nam officiis asperiores? Magnam iusto consequuntur, ratione eos molestias harum error tempore, praesentium deserunt, eligendi officiis iure amet sed esse non nam!
            Temporibus similique facilis ab repudiandae, mollitia aperiam possimus magni excepturi! Corporis fugit, id perferendis atque eligendi fuga, sequi voluptate vitae eius nobis minus possimus repellendus eaque placeat labore, quis debitis?
            Aliquam deleniti impedit magni alias asperiores eligendi voluptatum necessitatibus doloremque modi at! Sunt assumenda eaque non, voluptates rem dicta? Cum, ullam! Quisquam, mollitia vero. Cupiditate ipsa quia quisquam placeat deserunt?
            Delectus magni minus excepturi quos, corrupti fugit consequatur praesentium. Perferendis sunt amet dicta eligendi, facilis eos consectetur accusantium doloremque illo blanditiis ipsa fuga nobis, dignissimos expedita, tempore error repellat sed!
            Placeat minus officia deserunt quod nobis laudantium, non doloremque autem magni sint debitis qui, quisquam sed eius porro? Pariatur perferendis laboriosam aliquid nobis odit modi, ullam itaque rem minima porro.
            Minus vero veniam reiciendis, aspernatur tempore ea atque consectetur maiores molestias? Similique qui omnis inventore, minus quos optio eos fuga repudiandae, ducimus necessitatibus ipsum. Dolore modi ab commodi libero sunt.
            Consectetur quibusdam tempora, temporibus dicta pariatur accusantium similique aut! Omnis fugiat aspernatur, animi veritatis unde veniam minima ullam doloribus et rem? Tenetur quo rem libero corrupti distinctio rerum eveniet id!
            Veritatis, earum voluptas! Quo iure rem voluptates autem, eos eveniet. Laborum quis aperiam, nam molestiae, quo minima fugiat vitae eius, reprehenderit suscipit sequi voluptates libero possimus perspiciatis. Mollitia, quod veritatis!
            Dicta quos sequi ex explicabo temporibus aperiam est perferendis non repellat. Vitae, nam eveniet? Quidem non itaque, molestias aspernatur soluta error dolore impedit debitis illum, veritatis obcaecati labore unde est!
            Harum odio sed laborum fugit placeat, natus aspernatur illo tempore doloremque, labore eius ut et quis consequuntur excepturi ex quidem, dolorem quae voluptas. Beatae quidem praesentium, dolorem quis cupiditate a?
            Libero, sunt? Recusandae pariatur eius nemo sequi dolore dignissimos voluptate commodi numquam optio, eos laudantium esse dicta tempore non. Aperiam libero itaque sequi esse, fugiat veniam. Dignissimos perferendis vero repellat!
            Amet id sapiente qui rem tempore atque fugiat eius officia nisi, sunt sit repellendus blanditiis cum unde quo ipsum omnis autem et! Laborum ipsa blanditiis accusantium corrupti assumenda, similique quo!
            Perspiciatis pariatur libero iste unde delectus amet error! Eligendi, quisquam quod. Veritatis, beatae sunt! Rerum pariatur doloribus unde eligendi architecto aspernatur libero, corporis, magni ipsam ipsa alias porro! Inventore, veritatis!
            Soluta vitae sunt commodi libero reiciendis amet eveniet, natus obcaecati quod, magni necessitatibus consequatur eius! Minus illum nulla repellat voluptatum similique corrupti impedit accusantium repudiandae quas, pariatur neque id minima!
            Totam vitae nemo delectus at consectetur voluptatum officia aliquid voluptates. Ea quae qui officiis, facilis, vero dolores assumenda similique accusantium quos sunt harum ullam placeat cupiditate iste reiciendis a eligendi.
            Pariatur repellat distinctio aut laborum, nisi, temporibus amet eum ut consequuntur earum quaerat ea tempore! Dolorum libero eveniet, natus, ut sint quos magni unde magnam culpa consequuntur, repellat et sequi.
            Accusamus porro, expedita laboriosam nostrum fugit voluptates aspernatur dolore debitis repellat obcaecati dolorem modi. Nulla eos debitis autem officia voluptate repellendus voluptatem, in dolorum cupiditate veniam sapiente optio eveniet! Eligendi.
            Accusantium quos perspiciatis blanditiis voluptatibus reprehenderit dignissimos inventore sapiente ipsam praesentium. Temporibus assumenda eius beatae placeat modi cupiditate unde tenetur tempore totam, facilis dicta, ex soluta iste officia voluptatum rerum.
            Corrupti totam aspernatur mollitia pariatur quis quasi quae qui veniam, magni ab, excepturi accusantium? Pariatur dolores velit molestias fuga quis ad sunt, sit, consequuntur maxime commodi iste asperiores tempore! Voluptatum.
            Hic, repellendus libero. Odio deserunt autem ipsa officia facere facilis repudiandae et laborum laudantium tempore iusto commodi illo, nobis omnis sapiente ut illum error, quia reprehenderit, enim distinctio fugit eum?
            Numquam, praesentium commodi consequuntur fugit in quisquam. Delectus reprehenderit incidunt, quibusdam iusto reiciendis dolorum quidem, laudantium sint deleniti corrupti ullam excepturi doloribus? Impedit fugiat sequi, inventore ad commodi itaque. Pariatur!
            Soluta ipsum provident voluptate debitis eum, placeat quae voluptates rerum! Et neque voluptatem odio? Sapiente eaque et, explicabo amet magni dolorum, sit aliquid pariatur facilis possimus nemo nostrum alias reiciendis!
            Labore autem placeat debitis quod non modi soluta nulla quos voluptatibus harum! Itaque dicta laudantium amet eum perspiciatis est ad suscipit? Provident laudantium alias blanditiis tempora pariatur perferendis ex accusantium?
            Esse quidem quaerat cum numquam at repellat, neque, voluptatem nihil quas dolores velit inventore! Sequi sit quasi temporibus consequuntur cumque! Nemo at ab fugiat delectus fugit perspiciatis placeat similique quos.
            Aliquid aut tempora odio corporis architecto animi ea laboriosam cumque voluptate. Ut, porro. Id harum dolorum illum aliquid reprehenderit magni eum soluta hic dignissimos velit ratione, quidem porro cupiditate laborum?
            Ipsam beatae aliquam magni nobis officia quibusdam perspiciatis alias, deleniti similique tempora reiciendis aliquid exercitationem eaque. Vel praesentium rem culpa similique error voluptas, et dicta doloremque impedit quas unde quasi!
            Voluptatibus ad sequi veritatis vero officiis, facere, dolorem dignissimos possimus, natus placeat odio deleniti aperiam non voluptatum debitis consequatur quod consectetur soluta architecto quam? Inventore nisi molestias dolores ipsam amet.
            Quasi quo consectetur harum, delectus voluptate quis corporis repellat voluptatum laborum. Aspernatur nostrum laboriosam, quis qui repellat placeat soluta, perferendis porro obcaecati fuga nesciunt facilis repudiandae, ducimus provident assumenda cum.
            Omnis, in. Tempore nesciunt, quibusdam iure voluptatem veritatis perferendis quidem deserunt doloremque consectetur iste reiciendis a recusandae quas sed veniam placeat fugiat quae doloribus modi totam eos aliquam. Quisquam, deleniti.
            Repudiandae reprehenderit tempora deserunt ullam illo quae atque quidem beatae, repellendus perspiciatis doloribus dolores, maiores in debitis. Impedit harum id dolor? Natus tempora, recusandae nobis facilis cumque doloribus voluptas aspernatur!
            Temporibus quaerat necessitatibus autem ullam provident atque soluta, quos illum fugiat voluptas quisquam nemo velit molestias exercitationem minima, blanditiis nesciunt! Molestiae modi cupiditate ipsa maxime minima velit nulla repudiandae cumque.
            Autem quis assumenda iste libero inventore. Nobis aspernatur sunt harum enim aliquam praesentium vitae aut corrupti, ipsa fuga eligendi excepturi delectus ipsum quaerat nostrum. Sint natus repellendus molestiae numquam. Pariatur?
        </InfoTextContainer>
    );
});

export default InfoTab;