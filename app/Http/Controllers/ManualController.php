<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ManualController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $texto = '<ol start="1" type="1">
                <li><strong>USE OF FURNITURE</strong></li>
            </ol>
            <br>
            <ul type="circle">
                <li>After the installation of the furniture, leave it without bearing any kind of weight for about 24 hours. This is the time necessary for the products to bond completely.</li>
                <li>The areas around the sink, oven, and skirting boards are more prone to the effects of humidity and therefore warrant special attention.</li>
                <li>Immediately dry any liquid that has been spilled on the furniture.</li>
                <li>Fully and carefully open the doors of your furniture. When handling them, avoid slamming or leaving them ajar to prevent collisions with drawers, as this could damage the coating of the parts.</li>
                <li>The furniture must not be exposed to direct sunlight, as this could alter its characteristics, cause yellowing, and reduce its durability. We recommend using blinds, curtains, or window films.</li>
                <li>When moving objects on top of the furniture for cleaning, lift them instead of dragging, as dragging may cause scratches on the surface.</li>
                <li>Do not place excessive weight on the furniture and never lean or stand on the doors, as this may cause warping, misalignment, or breakage.</li>
                <li>Do not lean on drawers to reach upper parts. Pay special attention to children, as they may use open drawers as “stairs” to climb onto countertops.</li>
                <li>Do not hang wet or damp towels over the furniture doors. Over time, moisture may cause permanent damage.</li>
                <li>Do not place hot pans, trays, baking dishes, or other heated utensils directly on countertops, as this may cause damage. Always use heat-resistant supports or pads for protection.</li>
                <li>Do not cut food directly on countertops, as cutting tools can damage the surface finish. Always use cutting boards or other protective supports.</li>
                <li>Do not use utility knives or other sharp or pointed objects to make cuts on the surfaces. The coatings may become permanently scratched or damaged.</li>
                <li>Avoid contact of ink (such as from pens) with the coatings of cabinets and countertops, as it can cause stains. Use pen holders and protective mats to store such items.</li>
                <li>Always keep the furniture free from moisture. Use silicone-based sealants to seal the joints between countertops, sinks, and wall coverings. Regularly check the installations to prevent leaks.</li>
            </ul>
            <br>

            <ol start="2" type="1">
                <li><strong>WEIGHT</strong></li>
            </ol>
            <br>

            <ul type="circle">
                <li>Check the maximum weight borne (without damaging the furniture) for each internal shelf, on the upper and lower modules:</li>
            </ul>
            <p>
                <strong>Kitchen and Bathroom</strong><br>
            </p>
            <table border="1" cellspacing="0" cellpadding="0" width="100%" style="table-layout:fixed;">
                <tbody>
                    <tr>
                        <td>
                            <p align="center"><strong>Width</strong></p>
                        </td>
                        <td>
                            <p align="center"><strong>Upper Shelf</strong></p>
                        </td>
                        <td>
                            <p align="center"><strong>Lower Shelf</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">15 3/4”</p>
                        </td>
                        <td valign="top">
                            <p align="center">13.22 lb</p>
                        </td>
                        <td valign="top">
                            <p align="center">13.22 lb</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">23 5/8”</p>
                        </td>
                        <td valign="top">
                            <p align="center">19.84 lb</p>
                        </td>
                        <td valign="top">
                            <p align="center">19.84 lb</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">31 1/2”</p>
                        </td>
                        <td valign="top">
                            <p align="center">28.66 lb</p>
                        </td>
                        <td valign="top">
                            <p align="center">28.66 lb</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">39 3/8”</p>
                        </td>
                        <td valign="top">
                            <p align="center">35.27 lb</p>
                        </td>
                        <td valign="top">
                            <p align="center">35.27 lb</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">47 1/4”</p>
                        </td>
                        <td valign="top">
                            <p align="center">28.66 lb (larger)<br>30.86 lb (larger)</p>
                        </td>
                        <td valign="top">
                            <p align="center">28.66 lb (larger)<br>30.86 lb (larger)</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <br>

            <p>
                <strong>Bedrooms, Home Office and Home Theater</strong><br>
            </p>
            <table border="1" cellspacing="0" cellpadding="0" width="80%">
                <tbody>
                    <tr>
                        <td>
                            <p align="center"><strong>Width</strong></p>
                        </td>
                        <td>
                            <p align="center"><strong>Upper Shelf</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">13 3/4”</p>
                        </td>
                        <td valign="top">
                            <p align="center">13.22 lb</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">17 3/4”</p>
                        </td>
                        <td valign="top">
                            <p align="center">17.63 lb</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">27 9/16”</p>
                        </td>
                        <td valign="top">
                            <p align="center">26.45 lb</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">35 7/16”</p>
                        </td>
                        <td valign="top">
                            <p align="center">33.06 lb</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">39 3/8”</p>
                        </td>
                        <td valign="top">
                            <p align="center">35.27 lb</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">43 5/16”</p>
                        </td>
                        <td valign="top">
                            <p align="center">35.27 lb</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">47 1/4”</p>
                        </td>
                        <td valign="top">
                            <p align="center">35.27 lb</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <br>

            <p>
                <strong>External Shelves (Decorative)</strong><br><br>
                The external shelves can bear a load of <strong>22.05 lb per linear metre</strong>, provided the following conditions are met:
            </p>

            <ul type="circle">
                <li>Support brackets at intervals of 23.62”;<br>
                    Fixation at both ends.</li>
            </ul>

            <p>
                <strong>Please note:</strong><br>
                To avoid damage to the furniture, the maximum weight corresponding to each of the above measurements was calculated based on the even distribution of weight across the surface of the shelf.
            </p>

            <br>
            <ol start="3" type="1">
                <li><strong>CLEANING AND UP KEEP</strong></li>
            </ol>
            <br><p>
                3.1 <strong>Cabinets / Panels or Doors</strong>
            </p>
            <ul type="circle">
                <li>Always use a soft clean cloth, slightly moistened with warm water (just enough to make the dust stick), drying right afterwards. For more resistant stains, use a clean cloth moistened with neutral soap (not alkaline) and water. After cleaning, dry thoroughly with a soft cloth.</li>
            </ul>

            <p>
                <strong>Remember:</strong><br>
                The accumulation of dust, grease, or moisture over time may change the characteristics of the product. For this reason, never forget to clean your furniture regularly!
            </p>

            <table border="1" cellspacing="0" cellpadding="0" width="100%" style="table-layout:fixed;">
                <tbody>
                    <tr>
                        <td>
                            <p align="center"><strong>NEVER USE</strong></p>
                        </td>
                        <td>
                            <p align="center"><strong>WHY</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">A wet cloth.</p>
                        </td>
                        <td valign="top">
                            <p align="center">Excess accumulation of water may cause damage to the furniture.</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Dishwashing cloth.</p>
                        </td>
                        <td valign="top">
                            <p align="center">May contain residue.</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">A dry cloth.</p>
                        </td>
                        <td valign="top">
                            <p align="center">It does not clean and also wears out the furniture over time.</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Waxes.</p>
                        </td>
                        <td valign="top">
                            <p align="center">May leave residue, causing stains on the furniture.</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Detergents*, instant cleaners, degreasers, or products containing ammonia or soap-based detergents (abrasive cleaners).</p>
                        </td>
                        <td valign="top">
                            <p align="center">These are chemicals that could damage the appearance and finish of the furniture.</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Hard or rough sponges and steel wool.</p>
                        </td>
                        <td valign="top">
                            <p align="center">They can scratch or damage the furniture.</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <br>
            <p>*Only the use of neutral detergents is recommended.</p>

            <br>
            <p class="background-black color-white" style="padding: 20px;">
                <strong>Avoid:</strong><br>
                Sharp materials, as they may scratch the furniture.<br>
                Products such as vinegar, salt, and lemon, which can cause damage to the furniture over time.<br>
                Be careful!
            </p>

            <br>
            <p>
                <strong>Painted Pieces</strong><br><br>

                <strong>3.2.1 High-Shine Paint (Color Shine)</strong><br>
                For cleaning and preservation, use a moist flannel cloth. To dry, use a dry flannel cloth, but remember to avoid excessive friction.<br><br>

                We also advise using a small layer of silicone-based wax (such as polish for automotive use). This not only cleans but also provides a renewed appearance and a protective film layer. Apply a small amount with the help of a flannel cloth, then polish it with a wool cloth to achieve the proper shine.<br>
                This process should only be performed on doors that have Color Shine painting and should be repeated every 90 days.<br><br>

                <strong>3.2.2 Satin Finish Paint (Satin Color)</strong><br>
                Only use water and neutral detergent directly on an appropriate flannel cloth. After cleaning, dry completely using a dry flannel, always avoiding excessive friction.<br><br>

                <strong>Be careful:</strong><br>
                Excessive exposure to the sun can bring changes to the shade of color of the furniture and also make the paint dry up. Avoid it!
            </p>
            <table border="1" cellspacing="0" cellpadding="0" width="100%" style="table-layout:fixed;">
                <tbody>
                    <tr>
                        <td>
                            <p align="center"><strong>NEVER USE:</strong></p>
                        </td>
                        <td>
                            <p align="center"><strong>WHY:</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Abrasive cleaning products such as steel wool, soap-based detergents, alcohol, or others.</p>
                        </td>
                        <td valign="top">
                            <p align="center">They could scratch and damage the finish.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br>

            <p>
                <strong>Glass and Mirrors</strong>
            </p>
            <ul type="circle">
                <li>To clean, use water and neutral detergent directly on a suitable cloth or paper towel.</li>
            </ul>

            <table border="1" cellspacing="0" cellpadding="0" width="100%" style="table-layout:fixed;">
                <tbody>
                    <tr>
                        <td>
                            <p align="center"><strong>NEVER USE:</strong></p>
                        </td>
                        <td>
                            <p align="center"><strong>WHY:</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Dry cloth, steel wool, or any other abrasive object.</p>
                        </td>
                        <td valign="top">
                            <p align="center">Friction may damage the glass.</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Any product sprayed directly onto the glass.</p>
                        </td>
                        <td valign="top">
                            <p align="center">It can cause damage to coatings and accessories if they come into contact with the furniture.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br>

            <p>
                <strong>Handles</strong><br><br>
                Use only a soft cloth moistened with water, and dry thoroughly afterward.
            </p>

            <table border="1" cellspacing="0" cellpadding="0" width="100%" style="table-layout:fixed;">
                <tbody>
                    <tr>
                        <td>
                            <p align="center"><strong>NEVER USE:</strong></p>
                        </td>
                        <td>
                            <p align="center"><strong>WHY:</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Cleaning products.</p>
                        </td>
                        <td valign="top">
                            <p align="center">They may stain or cause damage to the handles.</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Abrasive products or objects.</p>
                        </td>
                        <td valign="top">
                            <p align="center">They can scratch or damage the handles.</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Alcohol, detergents, or solvents when cleaning metal handles.</p>
                        </td>
                        <td valign="top">
                            <p align="center">They remove the protective enamel coating (when applied to the handle).</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br>

            <p>
                <strong>Hinges and Slides</strong>
            </p>
            <ul type="circle">
                <li>Use a soft cloth or a brush with soft bristles to remove dust.<br><br>
                    <strong>Please note:</strong><br>
                    In coastal regions with sea air, this process should be done every 30 days.
                </li>
                <br>
                <li>Products such as salt, lemon, and vinegar can accelerate the rusting of metal accessories and should be avoided.</li>
            </ul>

            <table border="1" cellspacing="0" cellpadding="0" width="100%" style="table-layout:fixed;">
                <tbody>
                    <tr>
                        <td>
                            <p align="center"><strong>NEVER USE:</strong></p>
                        </td>
                        <td>
                            <p align="center"><strong>WHY:</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Cleaning products.</p>
                        </td>
                        <td valign="top">
                            <p align="center">These metal components have protective layers, not visible to the touch, and should not be exposed to any physical or chemical interference.</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Abrasive products or objects.</p>
                        </td>
                        <td valign="top">
                            <p align="center">They may scratch and cause damage to the materials used in hinges and slides.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p class="background-black color-white" style="padding: 20px;">
                <strong>AVOID:</strong><br>
                The accumulation of dust, fat, or moisture on the hinges and slides may hinder their proper functioning and/or cause oxidation (rust).
            </p>

            <p>
                <strong>Wire Products</strong><br>
            </p>
            <ul type="circle">
                <li>Cleaning should be carried out every 60 days. Use a cloth moistened with neutral detergent and water. After cleaning, dry completely with a dry cloth.</li>
                <li>To enhance the shine and durability of the product, use silicone-based wax.</li>
                <li>For chromed wire products, the cleaning process should be carried out every 30 days.</li>
            </ul>

            <table border="1" cellspacing="0" cellpadding="0" width="100%" style="table-layout:fixed;">
                <tbody>
                    <tr>
                        <td>
                            <p align="center"><strong>NEVER USE:</strong></p>
                        </td>
                        <td>
                            <p align="center"><strong>WHY:</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Solvents (alcohol and thinner), sanding files, rough or sharp materials (sponges).</p>
                        </td>
                        <td valign="top">
                            <p align="center">They can scratch or damage the product and cause rusting.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br>

            <p>
                <strong>Please note:</strong><br>
                In coastal regions with sea air, this process should be carried out every 30 days.<br>
                Products such as salt, lemon, and vinegar can accelerate the oxidation process of chromed accessories and should therefore be avoided.
            </p>

            <p>
                <strong>Accessories in General</strong><br>
            </p>
            <p>
                <strong>Stainless Steel and Enameled Parts</strong><br>
                Stainless steel and enameled parts should be cleaned with a slightly moistened cloth and neutral soap or degreasing agents (provided they do not contain chlorine or chlorine-based compounds).
            </p>

            <table border="1" cellspacing="0" cellpadding="0" width="100%" style="table-layout:fixed;">
                <tbody>
                    <tr>
                        <td>
                            <p align="center"><strong>NEVER USE:</strong></p>
                        </td>
                        <td>
                            <p align="center"><strong>WHY:</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Accessories with chrome finish in humid environments and coastal regions.</p>
                        </td>
                        <td valign="top">
                            <p align="center">They are prone to oxidation due to the action of water and sea air.</p>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <p align="center">Abrasive products or objects.</p>
                        </td>
                        <td valign="top">
                            <p align="center">They may scratch and cause damage to the materials.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br>

            <p>
                <strong>Remarks:</strong><br>
                Special products developed for cleaning and preserving stainless steel and enameled materials may indeed be used.
            </p>
            <br>

            <ol start="4" type="1">
                <li><strong>RAW MATERIALS</strong></li>
            </ol>
            <br>
            <ul type="circle">
                <li>Furniture produced in MDF and MDP are shipped out by the factory without any kind of fungi, termites or pests in general. The wooden boards are subjected to special equipment which makes use of high temperatures (approximately 200 °C) and pressure within their manufacturing process, which assures that there are no pests of any kind in this product.</li>
                <li>However, being products derived from wood, they could be attacked if they have any contact with products, materials or locations that are already infested.</li>
                <li>If there is a track record showing presence of termites or any other pest, then we recommend the identification of the point of infestation and later elimination of termites and/or application of an appropriate pesticide in the rooms before the furniture is installed (always following the period of isolation of the environment for the start of assembly). We also recommend that the pesticide be applied every six months.</li>
                <li>Regarding the proliferation of fungi, the environmental condition is a determining factor. Due to the fact that mold/mildew-causing fungi are present in atmospheric air, being their main dispersion route, they settle in environments that gather favorable conditions for their proliferation. When there is an occurrence of mold/mildew on furniture, it is necessary to first remove the contaminations in order to prevent the fungi from spreading to other furniture or rooms in the house, perform periodic cleaning and control the environmental conditions to avoid new infestation.</li>
            </ul>

            <p>
                Regarding the proliferation of fungus, the condition of the environment is a determining factor. Due to the fact that the fungus that cause mold / mildew are present in the atmospheric air, this being its main route of dispersion, they install themselves in environments that have favorable conditions for their proliferation. When there is an occurrence of mold / mildew in furniture, it is necessary to first remove the contamination, to prevent the fungus from proliferating by other furniture or enclosures in the house, perform periodic cleaning and control the conditions of the environment to prevent new infestation.
            </p>

            <p>
                REMEMBER:<br>
                Replacement of parts infested with termites is an action that does not eliminate the causes.<br>
                As these are raw materials that soak up moisture, they should not be exposed to the excessive moisture or humidity.
            </p>
            <br>

            <ol start="5" type="1">
                <li><strong>MISCELLANEOUS COMMENTS</strong></li>
            </ol>
            <br>

            <ul type="circle">
                <li>When using the furniture on a daily basis, some situations need to be avoided so that the useful life of the product may be extended.</li>
                <li>Pay attention when choosing your cleaning products. Always check the chemical composition in order to identify compatibility with the materials used in furniture and accessories.</li>
                <li>Should you have any doubts not covered by this Manual, then please contact the dealer where the products were purchased or our Customer Relations Center (Central de Relacionamento com o Consumidor - CRC) which is open from Monday to Friday, 9 a.m. to 5 p.m., using the toll-free telephone 0800 008 9000; you may also access the section on our website which is <strong><a href="https://dellanno.com" target="_blank">www.dellanno.com</a></strong>.</li>
            </ul>

            <ol start="6" type="1">
                <li><strong>CERTIFICATE</strong></li>
            </ol>
            <br>
            <p><strong>The UNICASA products have a guarantee against possible defects in Workmanship, a warranty which takes effect on the day when assembly is finalized.</strong></p>

            <p><strong>WARRANTY PERIODS</strong></p>

            <table>
            <thead>
                <tr>
                <th>ITEM</th>
                <th>WARRANTY</th>
                <th>RESPONSIBILITY</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>Assembly and Adjustment</td>
                <td>90 days</td>
                <td>Resale</td>
                </tr>
                <tr>
                <td>Project and Maintenance</td>
                <td>90 days</td>
                <td>Resale</td>
                </tr>
                <tr>
                <td>Cabinets<sup>1</sup></td>
                <td>1825 days (5 year)</td>
                <td>Factory</td>
                </tr>
                <tr>
                <td>Laccas<sup>2</sup></td>
                <td>730 days (2 year)</td>
                <td>Factory</td>
                </tr>
                <tr>
                <td>Aluminium door with glass<sup>3</sup></td>
                <td>365 days (1 year)</td>
                <td>Factory</td>
                </tr>
                <tr>
                <td>Handles</td>
                <td>90 days<sup>4</sup></td>
                <td>Factory</td>
                </tr>
                <tr>
                <td>Hinges and Slides</td>
                <td>90 days<sup>4</sup></td>
                <td>Factory</td>
                </tr>
                <tr>
                <td>Accessories in General</td>
                <td>90 days<sup>4</sup></td>
                <td>Factory</td>
                </tr>
            </tbody>
            </table>

            <ul>
            <li><small><sup>1</sup> Boxes, doors, lids, panels and shelves made in MDF or MDP, which are part of the furniture considered.</small></li>
            <li><small><sup>2</sup> The design and assembly of the structured are the responsibility of the dealer.</small></li>
            <li><small><sup>3</sup> The contractual warranty shall not apply to natural wear and color variations resulting from exposure to the sun and other external agents.</small></li>
            <li><small><sup>4</sup> The warranty period for the items produced by third-party suppliers may vary according to the internal policy of each supplier.</small></li>
            </ul>

            <br>

            <p><strong>WARRANTY FOR APPARENT AND EASILY VISIBLE PROBLEMS:</strong></p>

            <p>The Warranty is set of ninety (90) days for defects of workmanship, when such defects are apparent and easily visible, counting from the date of installation.</p>

            <p><strong>LIMITATION OF WARRANTY:</strong></p>

            <p><strong>THIS WARRANTY DOES NOT COVER THE FOLLOWING:</strong></p>

            <ul type="circle">
            <li>Products not produced or commercialized by UNICASA INDÚSTRIA DE MÓVEIS S.A., including glass (except for those which are shipped with a metal door in aluminum), marble items, granite, stones in general, cubes, domestic appliances, upholstery and other accessories;</li>
            <li>Normal wear resulting from normal use of the product;</li>
            <li>The use of natural products may cause differences and variations between shades, design, characteristics, color, tones, grains and textures of products presented in catalogs and in showrooms and the products delivered for installation. Dell arno shall not be responsible for these differences and variations. Further, client also expressly understands and acknowledges that with the passage of time, wooden units may change their color from the color they were at initial installation. Dell arno shall not be responsible for such color changes;</li>
            <li>Failure to comply with any information or recommendation of the "OWNER\'S MANUAL" and warranty certificate;</li>
            <li>Damage caused by structural problems at the place of installation, including seepages of water, infestations by termites or by pests in general, appearance of mould, and others as they result from the installation environment;</li>
            <li>Inappropriate use, lack of regular maintenance and cleaning, or also the use of cleaning products that are not recommended;</li>
            <li>Defects arising from electric and hydraulic Installations;</li>
            <li>Defects arising from projects, transport, installations (of furniture) and dismantling of the structure by persons who have not been accredited by the authorized dealers;</li>
            <li>Placing of excessive weight on the furniture.</li>
            </ul>

            <p><strong>IMPORTANT:</strong></p>

            <ul type="circle">
            <li>Starting after the assembly has been finalized, respecting the time frames for each item as shown in the table of warranty time frames;</li>
            <li>The manufacturer reserves the right to make any changes to the products, as deemed necessary or useful, without the loss of the essential characteristics;</li>
            <li>The exercising of the rights of the client, as mentioned in this warranty certificate, shall only be valid if the facts showing the date of the assembly and the dealer where the product was acquired are duly shown, together with the official tax invoice (Nota Fiscal) of the purchase;</li>
            <li>Services involving items outside the normal product range shall mean a longer time frame for planning (please check with the dealer);</li>
            <li>Any other information can be found on the Internet at <a href="https://dellanno.com" target="_blank"><strong>dellanno.com</strong></a>.</li>
            </ul>';

        return Inertia::render('Manual', [
            'texto' => $texto,
            'arquivo' => rafator('files/dell-anno-hd_certificado_de_garantia.pdf')
        ]);
    }
};