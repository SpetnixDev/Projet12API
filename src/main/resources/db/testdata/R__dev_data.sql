TRUNCATE TABLE
    user_association_supports,
    user_subscriptions,
    posts,
    association_tags,
    association_departments,
    auth_account_roles,
    refresh_tokens,
    auth_accounts,
    users,
    associations
CASCADE;

INSERT INTO roles (id, name)
VALUES (1, 'ROLE_ADMIN'),
       (2, 'ROLE_UNVERIFIED'),
       (3, 'ROLE_USER'),
       (4, 'ROLE_ASSOCIATION')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tags (id, code, label)
VALUES (1, 'EDUCATION', 'Éducation'),
       (2, 'CULTURE', 'Culture'),
       (3, 'SPORT', 'Sport'),
       (4, 'SOLIDARITE', 'Solidarité'),
       (5, 'ENVIRONNEMENT', 'Environnement'),
       (6, 'JEUNESSE', 'Jeunesse'),
       (7, 'SANTE', 'Santé'),
       (8, 'HUMANITAIRE', 'Humanitaire'),
       (9, 'TECHNOLOGIE', 'Technologie'),
       (10, 'COMMUNAUTE', 'Communauté')
ON CONFLICT (id) DO NOTHING;

WITH inserted_associations AS (
    INSERT INTO associations (id, name, description, created_at)
        SELECT gen_random_uuid(),
               v.name,
               v.description,
               now()
        FROM (
                 VALUES
                     (
                         'Horizon Savoirs',
                         'Cette structure accompagne des enfants, des adolescents et des adultes dans leurs parcours d’apprentissage, en mettant l’accent sur le soutien scolaire, l’accès aux ressources pédagogiques et la lutte contre les inégalités éducatives. Elle développe également des ateliers de méthodologie, des temps d’échange avec les familles et des actions de terrain menées avec des établissements, des bibliothèques et des acteurs de quartier.'
                     ),
                     (
                         'Maison des Quartiers Vivants',
                         'Ancrée dans plusieurs territoires urbains, l’association conçoit des projets collectifs destinés à renforcer les liens de voisinage, à soutenir les initiatives habitantes et à faire émerger des espaces de participation locale. Son activité couvre aussi bien l’organisation d’événements conviviaux que l’accompagnement de dynamiques citoyennes autour de l’entraide, de la culture et de la vie de quartier.'
                     ),
                     (
                         'Mouvement Sport & Inclusion',
                         'L’association promeut une pratique sportive accessible, régulière et inclusive, en particulier pour les publics éloignés des clubs traditionnels ou confrontés à des obstacles sociaux, économiques ou physiques. Elle coordonne des cycles d’initiation, des rencontres inter-associatives et des actions de sensibilisation autour du sport comme levier de confiance, de santé et de cohésion.'
                     ),
                     (
                         'Solidarités de Proximité',
                         'Son cœur de mission repose sur l’accompagnement des personnes fragilisées par la précarité, l’isolement ou les ruptures de parcours, à travers des permanences d’écoute, de l’orientation et des dispositifs d’aide concrète. Les équipes interviennent au plus près des besoins, en articulation avec les partenaires sociaux, afin d’apporter des réponses dignes, réactives et adaptées aux réalités locales.'
                     ),
                     (
                         'Demain en Transition',
                         'Cette association porte des projets de sensibilisation écologique, de mobilisation citoyenne et de transformation des usages du quotidien dans une logique de transition concrète. Elle anime des ateliers, des chantiers participatifs et des événements publics autour de la réduction des déchets, de l’alimentation durable, de la biodiversité urbaine et des coopérations locales.'
                     ),
                     (
                         'Tremplin Jeunes Talents',
                         'La structure accompagne de jeunes porteurs d’initiative dans le développement de leurs compétences, la construction de leurs projets et leur insertion dans des réseaux utiles à leur progression. Elle propose un cadre mêlant mentorat, ateliers collectifs, mise en situation et valorisation des parcours, avec une attention particulière portée à l’égalité des chances.'
                     ),
                     (
                         'Atelier des Cultures Croisées',
                         'L’association imagine et produit des actions artistiques et culturelles qui favorisent la rencontre entre les publics, les disciplines et les mémoires locales. Expositions, résidences, ateliers de pratique et médiation de terrain s’y articulent pour rendre la culture plus accessible, plus vivante et davantage reliée aux habitants.'
                     ),
                     (
                         'Numérique Solidaire Lab',
                         'Ce collectif développe des projets d’inclusion numérique et d’innovation sociale en direction de publics variés : jeunes, seniors, associations de proximité et personnes peu familiarisées avec les outils digitaux. Les actions menées couvrent la médiation, la formation, l’accompagnement aux usages, ainsi que l’expérimentation de solutions numériques à impact territorial.'
                     ),
                     (
                         'Cap Familles Enfance',
                         'L’association intervient auprès des familles, des enfants et des professionnels de proximité pour prévenir les fragilités sociales, soutenir la parentalité et créer des environnements plus sécurisants pour les mineurs. Elle met en œuvre des espaces d’accueil, des ateliers collectifs, des temps d’écoute et des partenariats opérationnels avec les acteurs éducatifs et médico-sociaux.'
                     ),
                     (
                         'Patrimoines en Partage',
                         'La structure valorise le patrimoine matériel et immatériel à travers des projets de médiation, de transmission et d’animation à destination d’un large public. Son approche repose sur la mise en récit des territoires, le dialogue entre générations et la création de formats participatifs permettant de redonner vie à des savoir-faire, des archives et des lieux souvent méconnus.'
                     ),
                     (
                         'Passerelle Formation Emploi',
                         'L’association accompagne des personnes en recherche d’orientation, de qualification ou de réinsertion vers des parcours plus stables et plus lisibles. Elle articule diagnostic, ateliers pratiques, remobilisation, découverte des métiers et travail en réseau avec les structures d’insertion afin de sécuriser les étapes de reprise d’activité.'
                     ),
                     (
                         'Urgence Main Tendue',
                         'Mobilisée sur des interventions humanitaires et des dispositifs d’aide d’urgence, l’association agit auprès de publics touchés par des crises sociales, sanitaires ou climatiques. Ses équipes coordonnent collectes, distributions, appuis logistiques et relais de terrain, tout en cherchant à maintenir une réponse rapide, structurée et respectueuse des personnes accompagnées.'
                     ),
                     (
                         'Santé pour Tous Territoires',
                         'Cette organisation mène des actions de prévention, d’information et d’accompagnement en santé, avec une attention particulière portée aux inégalités d’accès aux soins et à la compréhension des parcours médicaux. Elle déploie des campagnes locales, des temps de sensibilisation et des partenariats avec des professionnels pour renforcer le repérage précoce et la santé de proximité.'
                     ),
                     (
                         'Réseau Fetes & Liens',
                         'L’association conçoit des événements fédérateurs, des animations locales et des projets collectifs qui contribuent à dynamiser la vie associative et à renforcer le sentiment d’appartenance à un territoire. Elle travaille en lien avec des collectivités, des bénévoles et des structures partenaires pour créer des rendez-vous accessibles, utiles et ancrés dans la réalité des habitants.'
                     ),
                     (
                         'Citoyens en Action Locale',
                         'Le projet associatif vise à encourager l’engagement, la participation et la co-construction de solutions concrètes à l’échelle du quartier, de la commune ou du bassin de vie. Les actions reposent sur l’intelligence collective, la concertation, l’accompagnement de groupes d’habitants et le développement d’initiatives citoyennes durables.'
                     ),
                     (
                         'Chemins dAvenir Populaire',
                         'La structure développe des actions d’éducation populaire, de sensibilisation civique et de transmission permettant à chacun de mieux comprendre son environnement social, institutionnel et démocratique. Elle privilégie des formats accessibles, interactifs et ancrés dans le réel, afin de favoriser l’expression, l’esprit critique et la capacité d’agir.'
                     ),
                     (
                         'Presence Aines Services',
                         'L’association accompagne les personnes âgées dans leur quotidien en luttant contre l’isolement, en facilitant l’accès à l’information et en soutenant les liens sociaux de proximité. Elle organise des visites, des permanences, des ateliers adaptés et des actions collectives permettant de préserver l’autonomie, la dignité et la participation à la vie locale.'
                     ),
                     (
                         'Sciences Ouvertes Studio',
                         'Ce collectif fait dialoguer culture scientifique, médiation technique et expérimentation citoyenne à travers des ateliers, démonstrations, rencontres et dispositifs itinérants. Il cherche à rendre les sciences plus compréhensibles, plus concrètes et plus attractives, notamment pour les jeunes publics et les territoires éloignés des offres spécialisées.'
                     ),
                     (
                         'Campus Initiatives Solidaires',
                         'L’association soutient l’émergence de projets portés par des étudiantes et étudiants, en croisant engagement, vie de campus et impact social. Elle propose des accompagnements méthodologiques, des temps de mise en réseau, des ressources mutualisées et des actions collectives destinées à renforcer l’autonomie et la capacité de pilotage des équipes étudiantes.'
                     ),
                     (
                         'Coordination Projets Associatifs',
                         'Cette structure intervient comme ressource transversale au service des initiatives locales, en aidant les porteurs de projet à structurer leur gouvernance, leurs partenariats et leur développement. Elle mutualise des compétences, anime des espaces d’échange et apporte un appui opérationnel sur le montage, le suivi et la pérennisation des actions associatives.'
                     )
             ) AS v(name, description)
        WHERE NOT EXISTS (
            SELECT 1
            FROM associations a
            WHERE a.name = v.name
        )
        RETURNING id, name
),
     inserted_accounts AS (
         INSERT INTO auth_accounts (
                                    id,
                                    email,
                                    password_hash,
                                    verified,
                                    enabled,
                                    type,
                                    owner_id
             )
             SELECT gen_random_uuid(),
                    lower(replace(name, ' ', '')) || '@local.dev',
                    '$2a$10$devhash',
                    true,
                    true,
                    'ASSOCIATION',
                    id
             FROM inserted_associations
             ON CONFLICT (email) DO NOTHING
             RETURNING id
     )

INSERT INTO auth_account_roles (auth_account_id, role_id)
SELECT ia.id,
       4
FROM inserted_accounts ia
ON CONFLICT DO NOTHING;

UPDATE associations AS a
SET phone_number             = v.phone_number,
    contact_email            = v.contact_email,
    address                  = v.address,
    website_url              = v.website_url,
    rna_number               = v.rna_number,
    donation_use_description = v.donation_use_description
FROM (
         VALUES
             (
                 'Horizon Savoirs',
                 '03 20 45 18 72',
                 'contact@horizon-savoirs.local',
                 '12 rue des Écoles, 59000 Lille',
                 'https://horizon-savoirs.local',
                 'W595001234',
                 'Les dons financent principalement l’achat de matériel pédagogique, les ateliers gratuits et les permanences d’accompagnement des familles.'
             ),
             (
                 'Maison des Quartiers Vivants',
                 '01 48 22 30 11',
                 'bonjour@quartiers-vivants.local',
                 '8 avenue des Initiatives, 93100 Montreuil',
                 'https://quartiers-vivants.local',
                 'W931004218',
                 'Les contributions servent à louer du matériel événementiel, soutenir les projets habitants et financer des repas partagés.'
             ),
             (
                 'Mouvement Sport & Inclusion',
                 '04 72 18 90 44',
                 'contact@sport-inclusion.local',
                 '24 chemin des Stades, 69007 Lyon',
                 'sport-inclusion.local',
                 'W691009845',
                 'Les dons permettent d’acheter des équipements, de financer les licences solidaires et de former les encadrants bénévoles.'
             ),
             (
                 'Solidarités de Proximité',
                 '03 87 61 45 20',
                 'aide@solidarites-proximite.local',
                 '5 place de l’Entraide, 57000 Metz',
                 'https://solidarites-proximite.local',
                 'W573002017',
                 'Les dons sont répartis entre aide alimentaire, produits d’hygiène, transport solidaire et permanences d’écoute.'
             ),
             (
                 'Demain en Transition',
                 '02 99 33 76 12',
                 'contact@demain-transition.local',
                 '17 rue des Jardins Partagés, 35000 Rennes',
                 'https://demain-transition.local',
                 'W353008612',
                 'Les dons soutiennent les chantiers participatifs, l’achat de plants, les ateliers zéro déchet et la sensibilisation scolaire.'
             ),
             (
                 'Tremplin Jeunes Talents',
                 '05 56 44 21 08',
                 'contact@tremplin-talents.local',
                 '31 cours de la Jeunesse, 33000 Bordeaux',
                 'https://tremplin-talents.local',
                 'W332001906',
                 'Les dons financent le mentorat, les ateliers de préparation, les déplacements et les supports de formation.'
             ),
             (
                 'Atelier des Cultures Croisées',
                 '04 67 58 41 33',
                 'culture@cultures-croisees.local',
                 '9 rue des Ateliers, 34000 Montpellier',
                 'https://cultures-croisees.local',
                 'W343005520',
                 'Les dons servent à rémunérer les intervenants, acheter du matériel artistique et ouvrir les ateliers à des publics éloignés.'
             ),
             (
                 'Numérique Solidaire Lab',
                 '02 31 88 60 14',
                 'hello@numerique-solidaire.local',
                 '4 boulevard des Communs, 14000 Caen',
                 'https://numerique-solidaire.local',
                 'W142007305',
                 'Les dons couvrent la remise en état d’ordinateurs, les permanences de médiation numérique et les ateliers seniors.'
             ),
             (
                 'Cap Familles Enfance',
                 '04 91 27 55 19',
                 'familles@cap-enfance.local',
                 '15 traverse des Familles, 13005 Marseille',
                 'https://cap-enfance.local',
                 'W133009914',
                 'Les dons financent les espaces d’accueil, les actions parentalité, les kits éducatifs et les temps de répit accompagnés.'
             ),
             (
                 'Patrimoines en Partage',
                 '02 47 66 19 25',
                 'contact@patrimoines-partage.local',
                 '3 rue des Archives, 37000 Tours',
                 'https://patrimoines-partage.local',
                 'W372004377',
                 'Les dons soutiennent la numérisation d’archives, les visites guidées gratuites et la création de supports de médiation.'
             ),
             (
                 'Passerelle Formation Emploi',
                 '03 80 42 71 06',
                 'orientation@passerelle-emploi.local',
                 '19 avenue des Métiers, 21000 Dijon',
                 'https://passerelle-emploi.local',
                 'W212006145',
                 'Les dons sont utilisés pour financer les ateliers métiers, les transports des bénéficiaires et l’accompagnement individualisé.'
             ),
             (
                 'Urgence Main Tendue',
                 '05 90 81 22 40',
                 'urgence@main-tendue.local',
                 '2 rue de la Solidarité, 97110 Pointe-à-Pitre',
                 'https://main-tendue.local',
                 'W9G1003412',
                 'Les dons sont affectés aux collectes d’urgence, à l’achat de matériel de première nécessité et à la logistique terrain.'
             ),
             (
                 'Santé pour Tous Territoires',
                 '04 66 70 32 18',
                 'prevention@sante-territoires.local',
                 '28 rue de la Prévention, 30000 Nîmes',
                 'https://sante-territoires.local',
                 'W302008743',
                 'Les dons financent les campagnes locales de prévention, les permanences d’information et les supports accessibles.'
             ),
             (
                 'Réseau Fetes & Liens',
                 '02 40 19 84 22',
                 'contact@fetes-liens.local',
                 '6 quai des Associations, 44000 Nantes',
                 'https://fetes-liens.local',
                 'W442003918',
                 'Les dons permettent d’organiser des animations gratuites, de mutualiser du matériel et de soutenir les bénévoles.'
             ),
             (
                 'Citoyens en Action Locale',
                 '04 95 11 40 77',
                 'agir@citoyens-locaux.local',
                 '1 place de la Participation, 20200 Bastia',
                 'https://citoyens-locaux.local',
                 'W2B2001821',
                 'Les dons soutiennent les ateliers citoyens, les consultations locales et l’accompagnement des groupes d’habitants.'
             ),
             (
                 'Chemins dAvenir Populaire',
                 '01 42 70 15 38',
                 'contact@avenir-populaire.local',
                 '21 rue de l’Éducation Populaire, 75019 Paris',
                 'https://avenir-populaire.local',
                 'W751016284',
                 'Les dons financent les cycles d’éducation populaire, les supports pédagogiques et les interventions hors les murs.'
             ),
             (
                 'Presence Aines Services',
                 '05 55 12 63 49',
                 'contact@presence-aines.local',
                 '10 avenue de l’Autonomie, 87000 Limoges',
                 'https://presence-aines.local',
                 'W872004103',
                 'Les dons servent aux visites de convivialité, aux ateliers adaptés et aux transports accompagnés.'
             ),
             (
                 'Sciences Ouvertes Studio',
                 '04 76 91 20 50',
                 'contact@sciences-ouvertes.local',
                 '14 rue des Expériences, 38000 Grenoble',
                 'https://sciences-ouvertes.local',
                 'W381012772',
                 'Les dons financent les kits d’expérimentation, les démonstrations itinérantes et les ateliers gratuits pour les jeunes.'
             ),
             (
                 'Campus Initiatives Solidaires',
                 '05 61 49 28 10',
                 'campus@initiatives-solidaires.local',
                 '7 allée des Étudiants, 31000 Toulouse',
                 'https://campus-solidaires.local',
                 'W313007940',
                 'Les dons alimentent les micro-budgets étudiants, la mise en réseau des projets et l’achat de ressources mutualisées.'
             ),
             (
                 'Coordination Projets Associatifs',
                 '01 55 90 44 13',
                 'coordination@projets-associatifs.local',
                 '32 rue des Coopérations, 75011 Paris',
                 'https://projets-associatifs.local',
                 'W751021110',
                 'Les dons soutiennent l’accompagnement méthodologique, les formations bénévoles et les outils partagés entre associations.'
             )
     ) AS v(
            name,
            phone_number,
            contact_email,
            address,
            website_url,
            rna_number,
            donation_use_description
    )
WHERE a.name = v.name;

INSERT INTO association_tags (association_id, tag_id)
WITH mapping(association_name, tag_code) AS (
    VALUES
        ('Horizon Savoirs', 'EDUCATION'),
        ('Horizon Savoirs', 'JEUNESSE'),

        ('Maison des Quartiers Vivants', 'COMMUNAUTE'),
        ('Maison des Quartiers Vivants', 'CULTURE'),
        ('Maison des Quartiers Vivants', 'SOLIDARITE'),

        ('Mouvement Sport & Inclusion', 'SPORT'),
        ('Mouvement Sport & Inclusion', 'JEUNESSE'),
        ('Mouvement Sport & Inclusion', 'SANTE'),

        ('Solidarités de Proximité', 'SOLIDARITE'),
        ('Solidarités de Proximité', 'HUMANITAIRE'),
        ('Solidarités de Proximité', 'COMMUNAUTE'),

        ('Demain en Transition', 'ENVIRONNEMENT'),
        ('Demain en Transition', 'COMMUNAUTE'),
        ('Demain en Transition', 'EDUCATION'),

        ('Tremplin Jeunes Talents', 'JEUNESSE'),
        ('Tremplin Jeunes Talents', 'EDUCATION'),

        ('Atelier des Cultures Croisées', 'CULTURE'),
        ('Atelier des Cultures Croisées', 'COMMUNAUTE'),
        ('Atelier des Cultures Croisées', 'EDUCATION'),

        ('Numérique Solidaire Lab', 'TECHNOLOGIE'),
        ('Numérique Solidaire Lab', 'COMMUNAUTE'),
        ('Numérique Solidaire Lab', 'EDUCATION'),
        ('Numérique Solidaire Lab', 'SOLIDARITE'),

        ('Cap Familles Enfance', 'JEUNESSE'),
        ('Cap Familles Enfance', 'SOLIDARITE'),
        ('Cap Familles Enfance', 'SANTE'),

        ('Patrimoines en Partage', 'CULTURE'),
        ('Patrimoines en Partage', 'EDUCATION'),
        ('Patrimoines en Partage', 'COMMUNAUTE'),

        ('Passerelle Formation Emploi', 'EDUCATION'),
        ('Passerelle Formation Emploi', 'JEUNESSE'),
        ('Passerelle Formation Emploi', 'SOLIDARITE'),

        ('Urgence Main Tendue', 'HUMANITAIRE'),
        ('Urgence Main Tendue', 'SOLIDARITE'),

        ('Santé pour Tous Territoires', 'SANTE'),
        ('Santé pour Tous Territoires', 'SOLIDARITE'),
        ('Santé pour Tous Territoires', 'JEUNESSE'),

        ('Réseau Fetes & Liens', 'COMMUNAUTE'),
        ('Réseau Fetes & Liens', 'CULTURE'),

        ('Citoyens en Action Locale', 'COMMUNAUTE'),
        ('Citoyens en Action Locale', 'SOLIDARITE'),
        ('Citoyens en Action Locale', 'ENVIRONNEMENT'),

        ('Chemins dAvenir Populaire', 'EDUCATION'),
        ('Chemins dAvenir Populaire', 'COMMUNAUTE'),
        ('Chemins dAvenir Populaire', 'JEUNESSE'),

        ('Presence Aines Services', 'SANTE'),
        ('Presence Aines Services', 'SOLIDARITE'),
        ('Presence Aines Services', 'COMMUNAUTE'),

        ('Sciences Ouvertes Studio', 'TECHNOLOGIE'),
        ('Sciences Ouvertes Studio', 'CULTURE'),
        ('Sciences Ouvertes Studio', 'EDUCATION'),
        ('Sciences Ouvertes Studio', 'JEUNESSE'),

        ('Campus Initiatives Solidaires', 'JEUNESSE'),
        ('Campus Initiatives Solidaires', 'EDUCATION'),
        ('Campus Initiatives Solidaires', 'SOLIDARITE'),

        ('Coordination Projets Associatifs', 'COMMUNAUTE'),
        ('Coordination Projets Associatifs', 'SOLIDARITE'),
        ('Coordination Projets Associatifs', 'TECHNOLOGIE')
)
SELECT a.id, t.id
FROM mapping m
         JOIN associations a ON a.name = m.association_name
         JOIN tags t ON t.code = m.tag_code
ON CONFLICT DO NOTHING;

INSERT INTO association_departments (association_id, department_code)
WITH mapping(association_name, department_code) AS (
    VALUES
        ('Horizon Savoirs', '59'),
        ('Horizon Savoirs', '62'),
        ('Horizon Savoirs', '80'),

        ('Maison des Quartiers Vivants', '75'),
        ('Maison des Quartiers Vivants', '77'),
        ('Maison des Quartiers Vivants', '91'),
        ('Maison des Quartiers Vivants', '92'),
        ('Maison des Quartiers Vivants', '93'),
        ('Maison des Quartiers Vivants', '94'),
        ('Maison des Quartiers Vivants', '95'),

        ('Mouvement Sport & Inclusion', '38'),
        ('Mouvement Sport & Inclusion', '42'),
        ('Mouvement Sport & Inclusion', '69'),
        ('Mouvement Sport & Inclusion', '73'),
        ('Mouvement Sport & Inclusion', '74'),

        ('Solidarités de Proximité', '51'),
        ('Solidarités de Proximité', '54'),
        ('Solidarités de Proximité', '55'),
        ('Solidarités de Proximité', '57'),
        ('Solidarités de Proximité', '67'),
        ('Solidarités de Proximité', '68'),

        ('Demain en Transition', '22'),
        ('Demain en Transition', '29'),
        ('Demain en Transition', '35'),
        ('Demain en Transition', '44'),
        ('Demain en Transition', '56'),

        ('Tremplin Jeunes Talents', '16'),
        ('Tremplin Jeunes Talents', '17'),
        ('Tremplin Jeunes Talents', '33'),
        ('Tremplin Jeunes Talents', '40'),
        ('Tremplin Jeunes Talents', '64'),

        ('Atelier des Cultures Croisées', '11'),
        ('Atelier des Cultures Croisées', '31'),
        ('Atelier des Cultures Croisées', '34'),
        ('Atelier des Cultures Croisées', '66'),
        ('Atelier des Cultures Croisées', '81'),

        ('Numérique Solidaire Lab', '14'),
        ('Numérique Solidaire Lab', '27'),
        ('Numérique Solidaire Lab', '50'),
        ('Numérique Solidaire Lab', '61'),
        ('Numérique Solidaire Lab', '76'),

        ('Cap Familles Enfance', '4'),
        ('Cap Familles Enfance', '6'),
        ('Cap Familles Enfance', '13'),
        ('Cap Familles Enfance', '83'),
        ('Cap Familles Enfance', '84'),

        ('Patrimoines en Partage', '18'),
        ('Patrimoines en Partage', '28'),
        ('Patrimoines en Partage', '37'),
        ('Patrimoines en Partage', '41'),
        ('Patrimoines en Partage', '45'),

        ('Passerelle Formation Emploi', '21'),
        ('Passerelle Formation Emploi', '25'),
        ('Passerelle Formation Emploi', '39'),
        ('Passerelle Formation Emploi', '58'),
        ('Passerelle Formation Emploi', '71'),
        ('Passerelle Formation Emploi', '89'),
        ('Passerelle Formation Emploi', '90'),

        ('Urgence Main Tendue', '971'),
        ('Urgence Main Tendue', '972'),
        ('Urgence Main Tendue', '973'),
        ('Urgence Main Tendue', '974'),
        ('Urgence Main Tendue', '976'),

        ('Santé pour Tous Territoires', '30'),
        ('Santé pour Tous Territoires', '34'),
        ('Santé pour Tous Territoires', '48'),
        ('Santé pour Tous Territoires', '84'),

        ('Réseau Fetes & Liens', '44'),
        ('Réseau Fetes & Liens', '49'),
        ('Réseau Fetes & Liens', '53'),
        ('Réseau Fetes & Liens', '72'),
        ('Réseau Fetes & Liens', '85'),

        ('Citoyens en Action Locale', '2A'),
        ('Citoyens en Action Locale', '2B'),

        ('Chemins dAvenir Populaire', '75'),
        ('Chemins dAvenir Populaire', '77'),
        ('Chemins dAvenir Populaire', '78'),
        ('Chemins dAvenir Populaire', '91'),
        ('Chemins dAvenir Populaire', '92'),
        ('Chemins dAvenir Populaire', '93'),
        ('Chemins dAvenir Populaire', '94'),
        ('Chemins dAvenir Populaire', '95'),

        ('Presence Aines Services', '19'),
        ('Presence Aines Services', '23'),
        ('Presence Aines Services', '24'),
        ('Presence Aines Services', '47'),
        ('Presence Aines Services', '87'),

        ('Sciences Ouvertes Studio', '1'),
        ('Sciences Ouvertes Studio', '38'),
        ('Sciences Ouvertes Studio', '42'),
        ('Sciences Ouvertes Studio', '69'),
        ('Sciences Ouvertes Studio', '71'),

        ('Campus Initiatives Solidaires', '31'),
        ('Campus Initiatives Solidaires', '33'),
        ('Campus Initiatives Solidaires', '35'),
        ('Campus Initiatives Solidaires', '44'),
        ('Campus Initiatives Solidaires', '59'),
        ('Campus Initiatives Solidaires', '69'),
        ('Campus Initiatives Solidaires', '75'),

        ('Coordination Projets Associatifs', '13'),
        ('Coordination Projets Associatifs', '31'),
        ('Coordination Projets Associatifs', '33'),
        ('Coordination Projets Associatifs', '34'),
        ('Coordination Projets Associatifs', '44'),
        ('Coordination Projets Associatifs', '59'),
        ('Coordination Projets Associatifs', '67'),
        ('Coordination Projets Associatifs', '69'),
        ('Coordination Projets Associatifs', '75'),
        ('Coordination Projets Associatifs', '93')
)
SELECT a.id, d.code
FROM mapping m
         JOIN associations a ON a.name = m.association_name
         JOIN departments d ON d.code = m.department_code
ON CONFLICT DO NOTHING;

WITH inserted_users AS (
    INSERT INTO users (id, username)
        SELECT gen_random_uuid(), v.username
        FROM (
                 VALUES
                     ('alice_martin'),
                     ('samir_benali'),
                     ('claire_dupont'),
                     ('nora_petit'),
                     ('julien_moreau'),
                     ('emma_leroy'),
                     ('hugo_bernard'),
                     ('ines_garcia')
             ) AS v(username)
        ON CONFLICT (username) DO NOTHING
        RETURNING id, username
),
     inserted_user_accounts AS (
         INSERT INTO auth_accounts (
                                    id,
                                    email,
                                    password_hash,
                                    verified,
                                    enabled,
                                    type,
                                    owner_id
             )
             SELECT gen_random_uuid(),
                    replace(username, '_', '.') || '@local.dev',
                    '$2a$10$devhash',
                    true,
                    true,
                    'USER',
                    id
             FROM inserted_users
             ON CONFLICT (email) DO NOTHING
             RETURNING id
     )
INSERT INTO auth_account_roles (auth_account_id, role_id)
SELECT iua.id,
       3
FROM inserted_user_accounts iua
ON CONFLICT DO NOTHING;

INSERT INTO user_subscriptions (user_id, association_id, subscribed_at)
WITH mapping(username, association_name, subscribed_at) AS (
    VALUES
        ('alice_martin', 'Horizon Savoirs', now() - interval '28 days'),
        ('alice_martin', 'Demain en Transition', now() - interval '21 days'),
        ('alice_martin', 'Numérique Solidaire Lab', now() - interval '12 days'),
        ('samir_benali', 'Mouvement Sport & Inclusion', now() - interval '24 days'),
        ('samir_benali', 'Passerelle Formation Emploi', now() - interval '16 days'),
        ('samir_benali', 'Campus Initiatives Solidaires', now() - interval '8 days'),
        ('claire_dupont', 'Atelier des Cultures Croisées', now() - interval '32 days'),
        ('claire_dupont', 'Patrimoines en Partage', now() - interval '20 days'),
        ('claire_dupont', 'Réseau Fetes & Liens', now() - interval '6 days'),
        ('nora_petit', 'Solidarités de Proximité', now() - interval '17 days'),
        ('nora_petit', 'Urgence Main Tendue', now() - interval '10 days'),
        ('nora_petit', 'Santé pour Tous Territoires', now() - interval '4 days'),
        ('julien_moreau', 'Citoyens en Action Locale', now() - interval '18 days'),
        ('julien_moreau', 'Chemins dAvenir Populaire', now() - interval '11 days'),
        ('julien_moreau', 'Coordination Projets Associatifs', now() - interval '3 days'),
        ('emma_leroy', 'Cap Familles Enfance', now() - interval '26 days'),
        ('emma_leroy', 'Presence Aines Services', now() - interval '9 days'),
        ('hugo_bernard', 'Sciences Ouvertes Studio', now() - interval '14 days'),
        ('hugo_bernard', 'Numérique Solidaire Lab', now() - interval '7 days'),
        ('ines_garcia', 'Maison des Quartiers Vivants', now() - interval '19 days'),
        ('ines_garcia', 'Tremplin Jeunes Talents', now() - interval '5 days')
)
SELECT u.id, a.id, m.subscribed_at
FROM mapping m
         JOIN users u ON u.username = m.username
         JOIN associations a ON a.name = m.association_name
ON CONFLICT DO NOTHING;

INSERT INTO user_association_supports (user_id, association_id, supported_at)
WITH mapping(username, association_name, supported_at) AS (
    VALUES
        ('alice_martin', 'Horizon Savoirs', now() - interval '25 days'),
        ('alice_martin', 'Demain en Transition', now() - interval '20 days'),
        ('samir_benali', 'Mouvement Sport & Inclusion', now() - interval '22 days'),
        ('samir_benali', 'Campus Initiatives Solidaires', now() - interval '7 days'),
        ('claire_dupont', 'Atelier des Cultures Croisées', now() - interval '30 days'),
        ('claire_dupont', 'Patrimoines en Partage', now() - interval '18 days'),
        ('nora_petit', 'Solidarités de Proximité', now() - interval '15 days'),
        ('nora_petit', 'Urgence Main Tendue', now() - interval '9 days'),
        ('nora_petit', 'Santé pour Tous Territoires', now() - interval '4 days'),
        ('julien_moreau', 'Citoyens en Action Locale', now() - interval '17 days'),
        ('julien_moreau', 'Coordination Projets Associatifs', now() - interval '2 days'),
        ('emma_leroy', 'Cap Familles Enfance', now() - interval '24 days'),
        ('emma_leroy', 'Presence Aines Services', now() - interval '8 days'),
        ('hugo_bernard', 'Sciences Ouvertes Studio', now() - interval '13 days'),
        ('hugo_bernard', 'Numérique Solidaire Lab', now() - interval '6 days'),
        ('ines_garcia', 'Maison des Quartiers Vivants', now() - interval '18 days'),
        ('ines_garcia', 'Tremplin Jeunes Talents', now() - interval '4 days'),
        ('alice_martin', 'Solidarités de Proximité', now() - interval '3 days'),
        ('samir_benali', 'Passerelle Formation Emploi', now() - interval '3 days'),
        ('claire_dupont', 'Réseau Fetes & Liens', now() - interval '2 days')
)
SELECT u.id, a.id, m.supported_at
FROM mapping m
         JOIN users u ON u.username = m.username
         JOIN associations a ON a.name = m.association_name
ON CONFLICT DO NOTHING;

INSERT INTO posts (title, content_source, content_rendered_html, posted_at, owner_id)
WITH mapping(association_name, title, content_source, content_rendered_html, age) AS (
    VALUES
        (
            'Horizon Savoirs',
            'Ouverture des inscriptions au soutien scolaire',
            'Les inscriptions au soutien scolaire du mercredi sont ouvertes. Les familles peuvent nous contacter par email ou passer lors de la permanence du vendredi.',
            '<p>Les inscriptions au soutien scolaire du mercredi sont ouvertes. Les familles peuvent nous contacter par email ou passer lors de la permanence du vendredi.</p>',
            '20 days'
        ),
        (
            'Horizon Savoirs',
            'Recherche de bénévoles en mathématiques',
            'Nous recherchons deux bénévoles pour accompagner des collégiens en mathématiques sur le créneau du mardi soir.',
            '<p>Nous recherchons deux bénévoles pour accompagner des collégiens en mathématiques sur le créneau du mardi soir.</p>',
            '4 days'
        ),
        (
            'Maison des Quartiers Vivants',
            'Atelier cuisine partagée samedi',
            'Un atelier cuisine partagée aura lieu samedi matin. L’objectif est de préparer un repas de quartier avec les habitants volontaires.',
            '<p>Un atelier cuisine partagée aura lieu samedi matin. L’objectif est de préparer un repas de quartier avec les habitants volontaires.</p>',
            '18 days'
        ),
        (
            'Maison des Quartiers Vivants',
            'Appel à idées pour la fête de quartier',
            'Nous collectons les idées d’animations pour la prochaine fête de quartier. Musique, jeux, stands associatifs : toutes les propositions sont bienvenues.',
            '<p>Nous collectons les idées d’animations pour la prochaine fête de quartier. Musique, jeux, stands associatifs : toutes les propositions sont bienvenues.</p>',
            '6 days'
        ),
        (
            'Mouvement Sport & Inclusion',
            'Cycle sport adapté au printemps',
            'Le nouveau cycle de sport adapté démarre le mois prochain avec des séances d’initiation accessibles aux débutants.',
            '<p>Le nouveau cycle de sport adapté démarre le mois prochain avec des séances d’initiation accessibles aux débutants.</p>',
            '16 days'
        ),
        (
            'Solidarités de Proximité',
            'Collecte de produits d’hygiène',
            'Nous lançons une collecte de produits d’hygiène pour compléter les distributions hebdomadaires. Les dépôts sont possibles au local associatif.',
            '<p>Nous lançons une collecte de produits d’hygiène pour compléter les distributions hebdomadaires. Les dépôts sont possibles au local associatif.</p>',
            '13 days'
        ),
        (
            'Demain en Transition',
            'Chantier participatif au jardin partagé',
            'Rendez-vous dimanche pour préparer les nouvelles parcelles du jardin partagé et installer les bacs de compost.',
            '<p>Rendez-vous dimanche pour préparer les nouvelles parcelles du jardin partagé et installer les bacs de compost.</p>',
            '11 days'
        ),
        (
            'Tremplin Jeunes Talents',
            'Soirée mentorat',
            'La prochaine soirée mentorat réunira jeunes porteurs de projet, bénévoles et partenaires locaux autour de retours d’expérience.',
            '<p>La prochaine soirée mentorat réunira jeunes porteurs de projet, bénévoles et partenaires locaux autour de retours d’expérience.</p>',
            '10 days'
        ),
        (
            'Atelier des Cultures Croisées',
            'Nouvelle résidence artistique',
            'Nous accueillons une résidence artistique autour des mémoires de quartier. Des ateliers ouverts seront proposés chaque mercredi.',
            '<p>Nous accueillons une résidence artistique autour des mémoires de quartier. Des ateliers ouverts seront proposés chaque mercredi.</p>',
            '9 days'
        ),
        (
            'Numérique Solidaire Lab',
            'Permanence numérique pour les démarches en ligne',
            'Une permanence gratuite est organisée jeudi après-midi pour accompagner les démarches administratives en ligne.',
            '<p>Une permanence gratuite est organisée jeudi après-midi pour accompagner les démarches administratives en ligne.</p>',
            '8 days'
        ),
        (
            'Cap Familles Enfance',
            'Groupe de parole parentalité',
            'Un groupe de parole parentalité reprend tous les quinze jours avec une professionnelle de l’écoute familiale.',
            '<p>Un groupe de parole parentalité reprend tous les quinze jours avec une professionnelle de l’écoute familiale.</p>',
            '7 days'
        ),
        (
            'Patrimoines en Partage',
            'Balade commentée sur les traces du quartier',
            'Une balade commentée permettra de découvrir des lieux peu connus et des archives locales collectées avec les habitants.',
            '<p>Une balade commentée permettra de découvrir des lieux peu connus et des archives locales collectées avec les habitants.</p>',
            '6 days'
        ),
        (
            'Passerelle Formation Emploi',
            'Atelier CV et préparation d’entretien',
            'Un atelier CV et préparation d’entretien est proposé aux personnes en recherche de stage, d’alternance ou d’emploi.',
            '<p>Un atelier CV et préparation d’entretien est proposé aux personnes en recherche de stage, d’alternance ou d’emploi.</p>',
            '5 days'
        ),
        (
            'Urgence Main Tendue',
            'Besoin de bénévoles logistiques',
            'Nous avons besoin de bénévoles pour trier les dons et préparer les distributions d’urgence de la semaine prochaine.',
            '<p>Nous avons besoin de bénévoles pour trier les dons et préparer les distributions d’urgence de la semaine prochaine.</p>',
            '5 days'
        ),
        (
            'Santé pour Tous Territoires',
            'Campagne de prévention santé',
            'Une campagne de prévention est organisée avec des professionnels partenaires pour faciliter l’accès à l’information santé.',
            '<p>Une campagne de prévention est organisée avec des professionnels partenaires pour faciliter l’accès à l’information santé.</p>',
            '4 days'
        ),
        (
            'Réseau Fetes & Liens',
            'Calendrier des animations locales',
            'Le calendrier des animations locales est disponible. Les associations partenaires peuvent encore proposer des stands.',
            '<p>Le calendrier des animations locales est disponible. Les associations partenaires peuvent encore proposer des stands.</p>',
            '4 days'
        ),
        (
            'Citoyens en Action Locale',
            'Réunion de co-construction',
            'Une réunion de co-construction aura lieu mardi pour prioriser les actions citoyennes du prochain trimestre.',
            '<p>Une réunion de co-construction aura lieu mardi pour prioriser les actions citoyennes du prochain trimestre.</p>',
            '3 days'
        ),
        (
            'Chemins dAvenir Populaire',
            'Cycle comprendre les institutions',
            'Un cycle d’éducation populaire démarre autour du fonctionnement des institutions locales et des moyens d’agir.',
            '<p>Un cycle d’éducation populaire démarre autour du fonctionnement des institutions locales et des moyens d’agir.</p>',
            '3 days'
        ),
        (
            'Presence Aines Services',
            'Appel à visiteurs bénévoles',
            'Nous recherchons de nouveaux visiteurs bénévoles pour renforcer les liens sociaux auprès de personnes âgées isolées.',
            '<p>Nous recherchons de nouveaux visiteurs bénévoles pour renforcer les liens sociaux auprès de personnes âgées isolées.</p>',
            '2 days'
        ),
        (
            'Sciences Ouvertes Studio',
            'Atelier fusées à eau',
            'Un atelier fusées à eau est organisé pour les jeunes publics, avec une approche ludique des notions de pression et de trajectoire.',
            '<p>Un atelier fusées à eau est organisé pour les jeunes publics, avec une approche ludique des notions de pression et de trajectoire.</p>',
            '2 days'
        ),
        (
            'Campus Initiatives Solidaires',
            'Bourse aux projets étudiants',
            'La bourse aux projets étudiants est ouverte. Les équipes peuvent demander un accompagnement méthodologique.',
            '<p>La bourse aux projets étudiants est ouverte. Les équipes peuvent demander un accompagnement méthodologique.</p>',
            '1 day'
        ),
        (
            'Coordination Projets Associatifs',
            'Matinale gouvernance associative',
            'Une matinale dédiée à la gouvernance associative réunira des porteurs de projet et des bénévoles expérimentés.',
            '<p>Une matinale dédiée à la gouvernance associative réunira des porteurs de projet et des bénévoles expérimentés.</p>',
            '12 hours'
        )
)
SELECT v.title,
       v.content_source,
       v.content_rendered_html,
       now() - v.age::interval,
       a.id
FROM mapping v
         JOIN associations a ON a.name = v.association_name;
