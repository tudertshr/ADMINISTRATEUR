/* NetAcademy — Simulateur CLI Cisco IOS (guidé) */
(function () {
  'use strict';

  const LAB_SCENARIOS = {
    lab1: {
      id: 'lab1',
      title: 'Lab 1 — Réseau d\'entreprise (VLAN + RoAS + DHCP)',
      topology: 'R1 (routeur) ↔ SW1 (switch) — VLANs 10 HR, 20 Sales, 30 Market, 99 Native',
      defaultDevice: 'SW1',
      modules: [
        {
          title: 'Accès privilégié & mode configuration',
          device: 'SW1',
          steps: [
            { cmd: 'enable', hint: 'Passe en mode privilégié (comme sur un vrai équipement).', tuto: 'Sans enable, vous restez en mode utilisateur limité (SW1>).', success: 'Passage en mode enable.' },
            { cmd: 'configure terminal', alts: ['conf t', 'config t', 'configure t'], hint: 'Entrez en mode configuration globale.', tuto: 'Raccourci courant en lab : conf t', success: 'Mode configuration globale activé.' }
          ]
        },
        {
          title: 'Création des VLANs',
          device: 'SW1',
          steps: [
            { cmd: 'vlan 10', hint: 'Créez le VLAN 10.', tuto: 'Chaque VLAN a un ID numérique (1-4094).', success: 'Sous-mode config-vlan pour VLAN 10.' },
            { cmd: 'name HR', alts: ['name hr'], hint: 'Nommez ce VLAN HR.', tuto: 'Le nom facilite l\'administration (show vlan brief).', success: 'VLAN 10 nommé HR.' },
            { cmd: 'exit', hint: 'Sortez du sous-mode VLAN.', tuto: 'exit remonte d\'un niveau dans la hiérarchie IOS.', success: 'Retour en config globale.' },
            { cmd: 'vlan 20', hint: 'Créez le VLAN 20 (Sales).', tuto: 'Même procédure que pour le VLAN 10.', success: 'Sous-mode VLAN 20.' },
            { cmd: 'name SALES', alts: ['name sales'], hint: 'Nom : SALES', tuto: '', success: 'VLAN 20 nommé.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
            { cmd: 'vlan 30', hint: 'VLAN 30 (Marketing).', tuto: '', success: 'VLAN 30.' },
            { cmd: 'name MARKET', alts: ['name market', 'name MARKETING'], hint: 'Nom MARKET', tuto: '', success: 'OK.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
            { cmd: 'vlan 99', hint: 'VLAN 99 pour le native VLAN du trunk.', tuto: 'Le native VLAN transporte le trafic non tagué 802.1Q.', success: 'VLAN 99.' },
            { cmd: 'name NATIVE', alts: ['name native'], hint: 'Nommez-le NATIVE', tuto: '', success: 'OK.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'VLANs créés.' }
          ]
        },
        {
          title: 'Ports access (PCs)',
          device: 'SW1',
          steps: [
            { cmd: 'interface range fastethernet 0/1-2', alts: ['interface range fa0/1-2', 'int range fa0/1-2'], hint: 'Sélectionnez les ports PC du VLAN 10.', tuto: 'range permet de configurer plusieurs interfaces à la fois.', success: 'Mode config-if-range.' },
            { cmd: 'switchport mode access', hint: 'Port en mode access.', tuto: 'Un port access appartient à un seul VLAN.', success: 'Mode access.' },
            { cmd: 'switchport access vlan 10', hint: 'Assignez le VLAN 10.', tuto: '', success: 'Ports fa0/1-2 → VLAN 10.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
            { cmd: 'interface range fastethernet 0/3-4', alts: ['interface range fa0/3-4'], hint: 'Ports VLAN 20.', tuto: '', success: 'OK.' },
            { cmd: 'switchport mode access', hint: 'mode access', tuto: '', success: 'OK.' },
            { cmd: 'switchport access vlan 20', hint: 'VLAN 20', tuto: '', success: 'OK.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
            { cmd: 'interface range fastethernet 0/5-6', alts: ['interface range fa0/5-6'], hint: 'Ports VLAN 30.', tuto: '', success: 'OK.' },
            { cmd: 'switchport mode access', hint: 'mode access', tuto: '', success: 'OK.' },
            { cmd: 'switchport access vlan 30', hint: 'VLAN 30', tuto: '', success: 'OK.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'Ports access configurés.' }
          ]
        },
        {
          title: 'Trunk vers le routeur (SW1)',
          device: 'SW1',
          steps: [
            { cmd: 'interface gigabitethernet 0/1', alts: ['interface g0/1', 'int g0/1'], hint: 'Interface trunk vers R1.', tuto: 'Le trunk transporte plusieurs VLANs tagués.', success: 'Mode config-if.' },
            { cmd: 'switchport trunk encapsulation dot1q', hint: 'Encapsulation 802.1Q (obligatoire sur certains switches).', tuto: '', success: 'dot1q activé.' },
            { cmd: 'switchport mode trunk', hint: 'Mode trunk.', tuto: '', success: 'Port en trunk.' },
            { cmd: 'switchport trunk native vlan 99', hint: 'Native VLAN 99.', tuto: 'Doit correspondre au native VLAN côté routeur.', success: 'Native VLAN 99.' },
            { cmd: 'switchport trunk allowed vlan 10,20,30,99', alts: ['switchport trunk allowed vlan 10,20,30'], hint: 'Autorisez les VLANs utiles.', tuto: 'Limite les VLANs autorisés sur le trunk (sécurité).', success: 'Trunk SW1 terminé.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'Configuration switch terminée pour ce lab.' }
          ]
        },
        {
          title: 'Router-on-a-Stick (R1)',
          device: 'R1',
          steps: [
            { cmd: 'enable', hint: 'Sur R1 : enable', tuto: 'Changement d\'équipement simulé : vous êtes maintenant sur R1.', success: 'R1 — mode enable.', switchDevice: true },
            { cmd: 'configure terminal', alts: ['conf t'], hint: 'conf t sur R1', tuto: '', success: 'R1(config)#' },
            { cmd: 'interface gigabitethernet 0/0', alts: ['interface g0/0'], hint: 'Interface physique vers SW1.', tuto: '', success: 'OK.' },
            { cmd: 'no shutdown', hint: 'Activez l\'interface.', tuto: 'Par défaut les interfaces routeur sont administratively down.', success: 'Interface UP.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
            { cmd: 'interface gigabitethernet 0/0.10', alts: ['interface g0/0.10'], hint: 'Sous-interface VLAN 10.', tuto: 'Une sous-interface par VLAN = Router-on-a-Stick.', success: 'OK.' },
            { cmd: 'encapsulation dot1q 10', hint: 'Encapsulation VLAN 10.', tuto: 'Lie la sous-interface au VLAN 10.', success: 'OK.' },
            { cmd: 'ip address 192.168.10.1 255.255.255.0', hint: 'Passerelle VLAN 10.', tuto: 'Première IP utilisable souvent réservée à la gateway.', success: 'Gateway HR configurée.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
            { cmd: 'interface gigabitethernet 0/0.20', alts: ['interface g0/0.20'], hint: 'Sous-interface VLAN 20.', tuto: '', success: 'OK.' },
            { cmd: 'encapsulation dot1q 20', hint: 'dot1q 20', tuto: '', success: 'OK.' },
            { cmd: 'ip address 192.168.20.1 255.255.255.0', hint: 'Gateway Sales', tuto: '', success: 'OK.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
            { cmd: 'interface gigabitethernet 0/0.30', alts: ['interface g0/0.30'], hint: 'Sous-interface VLAN 30.', tuto: '', success: 'OK.' },
            { cmd: 'encapsulation dot1q 30', hint: 'dot1q 30', tuto: '', success: 'OK.' },
            { cmd: 'ip address 192.168.30.1 255.255.255.0', hint: 'Gateway Market', tuto: '', success: 'OK.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'Inter-VLAN routing configuré.' }
          ]
        },
        {
          title: 'Pools DHCP (R1)',
          device: 'R1',
          steps: [
            { cmd: 'ip dhcp excluded-address 192.168.10.1 192.168.10.10', hint: 'Réservez les premières adresses.', tuto: 'Exclut la gateway et serveurs fixes du pool.', success: 'Exclusions OK.' },
            { cmd: 'ip dhcp pool VLAN10', alts: ['ip dhcp pool vlan10'], hint: 'Créez le pool DHCP.', tuto: '', success: 'Mode DHCP pool.' },
            { cmd: 'network 192.168.10.0 255.255.255.0', hint: 'Réseau du pool.', tuto: '', success: 'OK.' },
            { cmd: 'default-router 192.168.10.1', hint: 'Passerelle par défaut.', tuto: 'Option DHCP 3 (router).', success: 'OK.' },
            { cmd: 'dns-server 8.8.8.8', hint: 'Serveur DNS.', tuto: 'Option DHCP 6.', success: 'Pool VLAN10 terminé.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'Lab 1 configuration terminée ! Testez : show vlan brief (SW1) ou show ip dhcp binding (R1).' }
          ]
        }
      ]
    },
    lab2: {
      id: 'lab2',
      title: 'Lab 2 — EtherChannel LACP + STP',
      topology: 'SW1 (core) — liens redondants vers SW2, root bridge primary',
      defaultDevice: 'SW1',
      modules: [
        {
          title: 'EtherChannel LACP',
          device: 'SW1',
          steps: [
            { cmd: 'enable', hint: 'enable', tuto: '', success: 'OK.' },
            { cmd: 'configure terminal', alts: ['conf t'], hint: 'conf t', tuto: '', success: 'OK.' },
            { cmd: 'interface range gigabitethernet 0/1-4', alts: ['interface range g0/1-4'], hint: 'Ports membres du bundle.', tuto: '4 liens physiques agrégés logiquement.', success: 'OK.' },
            { cmd: 'channel-group 1 mode active', hint: 'LACP mode active.', tuto: 'active négocie avec le pair ; passive attend.', success: 'Ports dans group 1.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
            { cmd: 'interface port-channel 1', hint: 'Interface logique Port-channel.', tuto: '', success: 'OK.' },
            { cmd: 'switchport trunk encapsulation dot1q', hint: 'dot1q sur le Po.', tuto: '', success: 'OK.' },
            { cmd: 'switchport mode trunk', hint: 'mode trunk', tuto: '', success: 'EtherChannel trunk OK.' }
          ]
        },
        {
          title: 'STP — Root bridge primary',
          device: 'SW1',
          steps: [
            { cmd: 'exit', hint: 'Retour config globale si besoin.', tuto: '', success: 'OK.' },
            { cmd: 'spanning-tree mode rapid-pvst', alts: ['spanning-tree mode rstp'], hint: 'RSTP (rapid-pvst).', tuto: 'Convergence bien plus rapide que STP classique.', success: 'RSTP activé.' },
            { cmd: 'spanning-tree vlan 1-1005 root primary', hint: 'SW1 root primary.', tuto: 'Réduit la priorité pour gagner l\'élection root.', success: 'SW1 root primary — lab 2 terminé.' }
          ]
        }
      ]
    },
    lab3: {
      id: 'lab3',
      title: 'Lab 3 — Hardening sécurité switch',
      topology: 'SW — ports access, DHCP snooping, DAI, ports inutilisés',
      defaultDevice: 'SW1',
      modules: [
        {
          title: 'Port Security (ports access)',
          device: 'SW1',
          steps: [
            { cmd: 'enable', hint: 'enable', tuto: '', success: 'OK.' },
            { cmd: 'configure terminal', alts: ['conf t'], hint: 'conf t', tuto: '', success: 'OK.' },
            { cmd: 'interface range fastethernet 0/1-20', alts: ['interface range fa0/1-20'], hint: 'Tous les ports utilisateurs.', tuto: '', success: 'OK.' },
            { cmd: 'switchport mode access', hint: 'mode access', tuto: '', success: 'OK.' },
            { cmd: 'switchport nonegotiate', hint: 'Désactive DTP.', tuto: 'Évite les négociations trunk/access non voulues.', success: 'OK.' },
            { cmd: 'spanning-tree portfast', hint: 'PortFast sur access.', tuto: 'Passe directement en forwarding (PC uniquement !).', success: 'OK.' },
            { cmd: 'spanning-tree bpduguard enable', hint: 'BPDU Guard.', tuto: 'Protège si un switch non autorisé est branché.', success: 'OK.' },
            { cmd: 'switchport port-security', hint: 'Active Port Security.', tuto: '', success: 'OK.' },
            { cmd: 'switchport port-security maximum 2', hint: 'Max 2 MAC.', tuto: '', success: 'OK.' },
            { cmd: 'switchport port-security mac-address sticky', hint: 'MAC sticky.', tuto: 'Apprend et conserve les MAC autorisées.', success: 'OK.' },
            { cmd: 'switchport port-security violation restrict', hint: 'Violation restrict.', tuto: 'Drop + syslog, port reste up (vs shutdown).', success: 'Port security OK.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' }
          ]
        },
        {
          title: 'VLAN black-hole & ports shutdown',
          device: 'SW1',
          steps: [
            { cmd: 'vlan 999', hint: 'VLAN pour ports inutilisés.', tuto: '', success: 'OK.' },
            { cmd: 'name BLACKHOLE', alts: ['name blackhole'], hint: 'Nom explicite.', tuto: '', success: 'OK.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
            { cmd: 'interface range fastethernet 0/21-24', alts: ['interface range fa0/21-24'], hint: 'Ports non utilisés.', tuto: '', success: 'OK.' },
            { cmd: 'switchport access vlan 999', hint: 'Placez dans VLAN 999.', tuto: '', success: 'OK.' },
            { cmd: 'shutdown', hint: 'shutdown administratif.', tuto: 'Bonne pratique : shutdown les ports inutilisés.', success: 'OK.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' }
          ]
        },
        {
          title: 'DHCP Snooping & DAI',
          device: 'SW1',
          steps: [
            { cmd: 'ip dhcp snooping', hint: 'Active DHCP Snooping.', tuto: 'Bloque les serveurs DHCP rogue sur ports untrusted.', success: 'OK.' },
            { cmd: 'ip dhcp snooping vlan 10,20,30', hint: 'VLANs concernés.', tuto: '', success: 'OK.' },
            { cmd: 'interface gigabitethernet 0/1', alts: ['interface g0/1'], hint: 'Uplink vers routeur.', tuto: '', success: 'OK.' },
            { cmd: 'ip dhcp snooping trust', hint: 'Port trusted.', tuto: 'Seul le port vers le vrai serveur DHCP est trusted.', success: 'OK.' },
            { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
            { cmd: 'ip arp inspection vlan 10,20,30', hint: 'Dynamic ARP Inspection.', tuto: 'Valide ARP vs table DHCP snooping — anti spoofing.', success: 'Lab 3 terminé.' },
            { cmd: 'interface gigabitethernet 0/1', alts: ['interface g0/1'], hint: 'Retour sur uplink.', tuto: '', success: 'OK.' },
            { cmd: 'ip arp inspection trust', hint: 'Trust pour DAI.', tuto: '', success: 'Sécurité L2 complète !' }
          ]
        }
      ]
    },
    lab4: {
      id: 'lab4',
      title: 'Lab 4 — Dépannage (commandes show)',
      topology: 'Diagnostic méthodique L1 → L2 → L3 sur SW1 et R1',
      defaultDevice: 'SW1',
      modules: [
        {
          title: 'Vérifications couche 2 (SW1)',
          device: 'SW1',
          steps: [
            { cmd: 'enable', hint: 'enable', tuto: '', success: 'OK.' },
            { cmd: 'show vlan brief', hint: 'Listez les VLANs.', tuto: 'Vérifiez que les VLANs existent et que les ports sont assignés.', success: 'OK.' },
            { cmd: 'show interfaces trunk', hint: 'État des trunks.', tuto: 'Encapsulation, VLANs autorisés, native VLAN.', success: 'OK.' },
            { cmd: 'show mac address-table', alts: ['show mac address-table dynamic'], hint: 'Table MAC.', tuto: 'Confirme que les PCs sont appris sur les bons ports.', success: 'OK.' },
            { cmd: 'show spanning-tree summary', alts: ['show spanning-tree'], hint: 'STP.', tuto: 'Root bridge, ports bloqués ?', success: 'L2 OK.' }
          ]
        },
        {
          title: 'Vérifications couche 3 (R1)',
          device: 'R1',
          steps: [
            { cmd: 'enable', hint: 'Passez sur R1.', tuto: '', success: 'R1.', switchDevice: true },
            { cmd: 'show ip interface brief', hint: 'Interfaces IP.', tuto: 'Statut up/up ? Adresses correctes ?', success: 'OK.' },
            { cmd: 'show ip route', hint: 'Table de routage.', tuto: 'Routes connectées pour chaque sous-réseau VLAN ?', success: 'OK.' },
            { cmd: 'ping 192.168.20.11', hint: 'Test inter-VLAN.', tuto: 'Depuis R1, ping un PC du VLAN 20 si simulé.', success: 'Lab dépannage terminé !' }
          ]
        }
      ]
    },
    labfinal: {
      id: 'labfinal',
      title: '🏆 Lab Final — Récapitulatif complet (A → Z)',
      topology: 'Architecture entreprise : Internet ↔ R1 ↔ SW1 (core) ↔ SW2 (distribution) + PCs multi-VLAN. Protocoles : 802.1Q, STP, LACP, DHCP, DNS, SSH, sécurité L2.',
      defaultDevice: 'SW1',
      devices: ['SW1', 'SW2', 'R1'],
      hasTopology: true,
      modules: [
        { title: '① SW1 — Accès & VLANs (802.1Q)', device: 'SW1', steps: [
          { cmd: 'enable', hint: 'enable sur SW1', tuto: 'Début du lab final — même logique qu\'en production.', success: 'OK.' },
          { cmd: 'configure terminal', alts: ['conf t'], hint: 'Mode configuration globale.', tuto: '', success: 'OK.' },
          { cmd: 'hostname SW1', alts: ['host sw1'], hint: 'Nommez le switch.', tuto: 'hostname identifie l\'équipement dans les prompts et logs.', success: 'Hostname SW1.' },
          { cmd: 'vlan 10', hint: 'VLAN 10 HR', tuto: 'Segmentation logique — concept VLAN du cours.', success: 'OK.' },
          { cmd: 'name HR', alts: ['name hr'], hint: 'Nom HR', tuto: '', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'vlan 20', hint: 'VLAN 20', tuto: '', success: 'OK.' },
          { cmd: 'name SALES', alts: ['name sales'], hint: 'Nom SALES', tuto: '', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'vlan 30', hint: 'VLAN 30', tuto: '', success: 'OK.' },
          { cmd: 'name MARKET', alts: ['name market'], hint: 'Nom MARKET', tuto: '', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'vlan 99', hint: 'Native VLAN 99', tuto: 'VLAN natif pour trafic non tagué sur trunk.', success: 'OK.' },
          { cmd: 'name NATIVE', alts: ['name native'], hint: 'Nom NATIVE', tuto: '', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'VLANs créés.' }
        ]},
        { title: '② SW1 — Ports access & Trunk vers R1', device: 'SW1', steps: [
          { cmd: 'interface range fastethernet 0/1-2', alts: ['int range fa0/1-2'], hint: 'Ports VLAN 10.', tuto: 'Ports access = un seul VLAN.', success: 'OK.' },
          { cmd: 'switchport mode access', hint: 'mode access', tuto: '', success: 'OK.' },
          { cmd: 'switchport access vlan 10', hint: 'VLAN 10', tuto: '', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'interface range fastethernet 0/3-4', alts: ['int range fa0/3-4'], hint: 'Ports VLAN 20.', tuto: '', success: 'OK.' },
          { cmd: 'switchport mode access', hint: 'mode access', tuto: '', success: 'OK.' },
          { cmd: 'switchport access vlan 20', hint: 'VLAN 20', tuto: '', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'interface range fastethernet 0/5-6', alts: ['int range fa0/5-6'], hint: 'Ports VLAN 30.', tuto: '', success: 'OK.' },
          { cmd: 'switchport mode access', hint: 'mode access', tuto: '', success: 'OK.' },
          { cmd: 'switchport access vlan 30', hint: 'VLAN 30', tuto: '', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'interface gigabitethernet 0/1', alts: ['int g0/1'], hint: 'Trunk vers R1.', tuto: '802.1Q — plusieurs VLANs sur un lien.', success: 'OK.' },
          { cmd: 'switchport trunk encapsulation dot1q', hint: 'dot1q', tuto: '', success: 'OK.' },
          { cmd: 'switchport mode trunk', hint: 'mode trunk', tuto: '', success: 'OK.' },
          { cmd: 'switchport trunk native vlan 99', hint: 'native 99', tuto: '', success: 'OK.' },
          { cmd: 'switchport trunk allowed vlan 10,20,30,99', hint: 'VLANs autorisés', tuto: 'Filtre les VLANs sur le trunk (sécurité).', success: 'Trunk SW1↔R1 OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' }
        ]},
        { title: '③ SW1 — EtherChannel (LACP) + STP', device: 'SW1', steps: [
          { cmd: 'interface range gigabitethernet 0/2-3', alts: ['int range g0/2-3'], hint: 'Liens vers SW2.', tuto: 'EtherChannel = agrégation LACP (802.3ad).', success: 'OK.' },
          { cmd: 'channel-group 1 mode active', hint: 'LACP active', tuto: 'Au moins un côté en active pour négocier.', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'interface port-channel 1', alts: ['int po1'], hint: 'Port-channel 1', tuto: '', success: 'OK.' },
          { cmd: 'switchport mode trunk', hint: 'Trunk sur Po1', tuto: '', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'spanning-tree mode rapid-pvst', alts: ['spanning-tree mode rstp'], hint: 'RSTP', tuto: 'STP évite les boucles — convergence rapide.', success: 'RSTP activé.' },
          { cmd: 'spanning-tree vlan 1-1005 root primary', hint: 'Root primary', tuto: 'SW1 = root bridge pour tous les VLANs.', success: 'STP configuré.' }
        ]},
        { title: '④ SW1 — Sécurité L2 (Port-Sec, DHCP Snooping, DAI)', device: 'SW1', steps: [
          { cmd: 'interface range fastethernet 0/1-6', alts: ['int range fa0/1-6'], hint: 'Ports utilisateurs.', tuto: 'Durcissement contre attaques L2 du cours sécurité.', success: 'OK.' },
          { cmd: 'switchport port-security', hint: 'Port security', tuto: '', success: 'OK.' },
          { cmd: 'switchport port-security maximum 2', hint: 'max 2 MAC', tuto: '', success: 'OK.' },
          { cmd: 'switchport port-security mac-address sticky', hint: 'sticky', tuto: '', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'ip dhcp snooping', hint: 'DHCP Snooping', tuto: 'Anti serveur DHCP rogue.', success: 'OK.' },
          { cmd: 'ip dhcp snooping vlan 10,20,30', hint: 'VLANs surveillés', tuto: '', success: 'OK.' },
          { cmd: 'interface gigabitethernet 0/1', alts: ['int g0/1'], hint: 'Uplink R1', tuto: '', success: 'OK.' },
          { cmd: 'ip dhcp snooping trust', hint: 'trust', tuto: 'Port vers serveur DHCP légitime (R1).', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'ip arp inspection vlan 10,20,30', hint: 'DAI', tuto: 'Dynamic ARP Inspection — anti ARP spoofing.', success: 'Sécurité L2 OK.' }
        ]},
        { title: '⑤ SW2 — EtherChannel & Trunk (redondance)', device: 'SW2', steps: [
          { cmd: 'enable', hint: 'Sur SW2', tuto: 'Basculez sur SW2 (menu déroulant ou étape auto).', success: 'SW2.', switchDevice: true },
          { cmd: 'configure terminal', alts: ['conf t'], hint: 'conf t', tuto: '', success: 'OK.' },
          { cmd: 'hostname SW2', alts: ['host sw2'], hint: 'hostname SW2', tuto: '', success: 'OK.' },
          { cmd: 'interface range gigabitethernet 0/1-2', alts: ['int range g0/1-2'], hint: 'Vers SW1', tuto: '', success: 'OK.' },
          { cmd: 'channel-group 1 mode passive', hint: 'LACP passive', tuto: 'SW1 active + SW2 passive = EtherChannel formé.', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'spanning-tree vlan 1-1005 root secondary', hint: 'Root secondary', tuto: 'SW2 backup root si SW1 tombe.', success: 'SW2 configuré.' }
        ]},
        { title: '⑥ R1 — Router-on-a-Stick & adressage IP', device: 'R1', steps: [
          { cmd: 'enable', hint: 'Sur R1', tuto: 'Routage inter-VLAN — couche 3.', success: 'R1.', switchDevice: true },
          { cmd: 'configure terminal', alts: ['conf t'], hint: 'conf t', tuto: '', success: 'OK.' },
          { cmd: 'hostname R1', alts: ['host r1'], hint: 'hostname R1', tuto: '', success: 'OK.' },
          { cmd: 'interface gigabitethernet 0/0', alts: ['int g0/0'], hint: 'Lien vers SW1', tuto: '', success: 'OK.' },
          { cmd: 'no shutdown', hint: 'no shut', tuto: '', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'interface gigabitethernet 0/0.10', alts: ['int g0/0.10'], hint: 'Sous-int VLAN 10', tuto: 'RoAS : une sous-interface par VLAN.', success: 'OK.' },
          { cmd: 'encapsulation dot1q 10', hint: 'dot1q 10', tuto: '', success: 'OK.' },
          { cmd: 'ip address 192.168.10.1 255.255.255.0', hint: 'GW 192.168.10.1', tuto: 'Plan IP VLAN 10 : 192.168.10.0/24', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'interface gigabitethernet 0/0.20', alts: ['int g0/0.20'], hint: 'VLAN 20', tuto: '', success: 'OK.' },
          { cmd: 'encapsulation dot1q 20', hint: 'dot1q 20', tuto: '', success: 'OK.' },
          { cmd: 'ip address 192.168.20.1 255.255.255.0', hint: 'GW 192.168.20.1', tuto: '192.168.20.0/24', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'interface gigabitethernet 0/0.30', alts: ['int g0/0.30'], hint: 'VLAN 30', tuto: '', success: 'OK.' },
          { cmd: 'encapsulation dot1q 30', hint: 'dot1q 30', tuto: '', success: 'OK.' },
          { cmd: 'ip address 192.168.30.1 255.255.255.0', hint: 'GW 192.168.30.1', tuto: '192.168.30.0/24', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'interface gigabitethernet 0/1', alts: ['int g0/1'], hint: 'WAN Internet', tuto: 'Lien vers FAI / cloud.', success: 'OK.' },
          { cmd: 'ip address 203.0.113.2 255.255.255.252', hint: 'IP WAN', tuto: '203.0.113.0/30 — exemple public.', success: 'OK.' },
          { cmd: 'no shutdown', hint: 'no shut WAN', tuto: '', success: 'Routage L3 prêt.' }
        ]},
        { title: '⑦ R1 — DHCP (DORA) tous les VLANs', device: 'R1', steps: [
          { cmd: 'ip dhcp excluded-address 192.168.10.1 192.168.10.10', hint: 'Exclusions VLAN10', tuto: 'DHCP — processus DORA du cours.', success: 'OK.' },
          { cmd: 'ip dhcp pool VLAN10', alts: ['ip dhcp pool vlan10'], hint: 'Pool HR', tuto: '', success: 'OK.' },
          { cmd: 'network 192.168.10.0 255.255.255.0', hint: 'réseau', tuto: '', success: 'OK.' },
          { cmd: 'default-router 192.168.10.1', hint: 'gateway', tuto: 'Option 3 — routeur par défaut.', success: 'OK.' },
          { cmd: 'dns-server 8.8.8.8', hint: 'DNS 8.8.8.8', tuto: 'Option 6 — serveur DNS (lien avec module DNS).', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'ip dhcp excluded-address 192.168.20.1 192.168.20.10', hint: 'Exclusions VLAN20', tuto: '', success: 'OK.' },
          { cmd: 'ip dhcp pool VLAN20', alts: ['ip dhcp pool vlan20'], hint: 'Pool Sales', tuto: '', success: 'OK.' },
          { cmd: 'network 192.168.20.0 255.255.255.0', hint: 'réseau', tuto: '', success: 'OK.' },
          { cmd: 'default-router 192.168.20.1', hint: 'GW', tuto: '', success: 'OK.' },
          { cmd: 'dns-server 8.8.8.8', hint: 'DNS', tuto: '', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'ip dhcp excluded-address 192.168.30.1 192.168.30.10', hint: 'Exclusions VLAN30', tuto: '', success: 'OK.' },
          { cmd: 'ip dhcp pool VLAN30', alts: ['ip dhcp pool vlan30'], hint: 'Pool Market', tuto: '', success: 'OK.' },
          { cmd: 'network 192.168.30.0 255.255.255.0', hint: 'réseau', tuto: '', success: 'OK.' },
          { cmd: 'default-router 192.168.30.1', hint: 'GW', tuto: '', success: 'OK.' },
          { cmd: 'dns-server 8.8.8.8', hint: 'DNS', tuto: '', success: 'Pools DHCP complets.' }
        ]},
        { title: '⑧ R1 — Sécurité admin (SSH, services)', device: 'R1', steps: [
          { cmd: 'enable secret Cisco123!', hint: 'Mot de passe enable', tuto: 'Sécurité — enable secret (hash MD5).', success: 'OK.' },
          { cmd: 'ip domain-name netacademy.local', hint: 'domain-name', tuto: 'Requis pour générer clés SSH.', success: 'OK.' },
          { cmd: 'crypto key generate rsa modulus 2048', hint: 'Clés RSA SSH', tuto: 'Jamais Telnet en production — SSH port 22.', success: 'OK.' },
          { cmd: 'ip ssh version 2', hint: 'SSH v2', tuto: '', success: 'OK.' },
          { cmd: 'line vty 0 4', hint: 'Lignes VTY', tuto: '', success: 'OK.' },
          { cmd: 'transport input ssh', hint: 'SSH uniquement', tuto: '', success: 'OK.' },
          { cmd: 'exit', hint: 'exit', tuto: '', success: 'OK.' },
          { cmd: 'no ip http server', hint: 'Désactiver HTTP', tuto: 'Réduire surface d\'attaque.', success: 'OK.' },
          { cmd: 'no cdp run', hint: 'Désactiver CDP global', tuto: 'Ne pas divulguer infos voisinage.', success: 'Sécurité admin OK.' }
        ]},
        { title: '⑨ Validation finale — show & ping', device: 'SW1', steps: [
          { cmd: 'end', hint: 'Fin config → mode #', tuto: 'Vérification comme en examen / prod.', success: 'Mode privilégié.', switchDevice: true },
          { cmd: 'show vlan brief', hint: 'VLANs', tuto: '802.1Q — tous les VLANs visibles.', success: 'OK.' },
          { cmd: 'show interfaces trunk', hint: 'Trunks', tuto: '', success: 'OK.' },
          { cmd: 'show spanning-tree summary', alts: ['show spanning-tree'], hint: 'STP', tuto: '', success: 'OK.' },
          { cmd: 'show etherchannel summary', hint: 'EtherChannel', tuto: 'LACP — Po1 doit être UP.', success: 'SW1 validé.' }
        ]},
        { title: '⑩ Validation R1 — routage & DHCP', device: 'R1', steps: [
          { cmd: 'enable', hint: 'R1 enable', tuto: '', success: 'OK.', switchDevice: true },
          { cmd: 'show ip interface brief', hint: 'Interfaces IP', tuto: 'Toutes sous-interfaces up/up ?', success: 'OK.' },
          { cmd: 'show ip route', hint: 'Table de routage', tuto: 'Routes connectées 192.168.x.0/24.', success: 'OK.' },
          { cmd: 'show ip dhcp binding', hint: 'Baux DHCP', tuto: 'DHCP opérationnel si PCs connectés.', success: 'OK.' },
          { cmd: 'ping 192.168.20.11', hint: 'Ping inter-VLAN', tuto: 'Test connectivité L3.', success: 'OK.' },
          { cmd: 'ping 192.168.30.11', hint: 'Ping VLAN 30', tuto: '', success: 'OK.' },
          { cmd: 'write memory', alts: ['wr'], hint: 'Sauvegarder config', tuto: '🎉 LAB FINAL TERMINÉ — vous maîtrisez le réseau de A à Z !', success: '🏆 Félicitations ! Réseau entreprise complet configuré.' }
        ]}
      ]
    }
  };

  let cliState = {
    labId: 'lab1',
    device: 'SW1',
    hostname: 'SW1',
    mode: 'user',
    moduleIndex: 0,
    stepIndex: 0,
    history: []
  };

  const IOS_ABBREV = {
    'en': 'enable',
    'conf t': 'configure terminal',
    'config t': 'configure terminal',
    'configure t': 'configure terminal',
    'wr': 'write memory',
    'wr mem': 'write memory',
    'copy run start': 'write memory'
  };

  function normCmd(s) {
    let c = (s || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/^do\s+/, '');
    if (IOS_ABBREV[c]) c = IOS_ABBREV[c];
    c = c
      .replace(/^int /g, 'interface ')
      .replace(/^interface vlan /g, 'vlan ')
      .replace(/^interface gi(\d)/g, 'interface gigabitethernet $1')
      .replace(/^interface g0\//g, 'interface gigabitethernet 0/')
      .replace(/^interface fa(\d)/g, 'interface fastethernet $1')
      .replace(/^interface fa0\//g, 'interface fastethernet 0/')
      .replace(/^interface po(\d)/g, 'interface port-channel $1')
      .replace(/^interface port-channel /g, 'interface port-channel ')
      .replace(/^host /g, 'hostname ')
      .replace(/^sw /g, 'switchport ')
      .replace(/^span /g, 'spanning-tree ')
      .replace(/^sh /g, 'show ')
      .replace(/^ip route 0\.0\.0\.0 0\.0\.0\.0 /g, 'ip route ');
    return c;
  }

  function allExpectedVariants(step) {
    const list = [normCmd(step.cmd)];
    if (step.alts) step.alts.forEach(a => list.push(normCmd(a)));
    return [...new Set(list)];
  }

  /** Reconnaissance : exact, abréviations, début de commande, mots-partiels */
  function cmdMatches(input, step) {
    const n = normCmd(input);
    if (!n) return false;
    const variants = allExpectedVariants(step);

    for (const expected of variants) {
      if (n === expected) return { match: true, partial: false };
      if (expected.startsWith(n) && n.length >= 3) return { match: true, partial: true };
      if (n.startsWith(expected) && expected.length >= 5) return { match: true, partial: false };

      const nw = n.split(' ').filter(Boolean);
      const ew = expected.split(' ').filter(Boolean);
      if (nw.length > 0 && nw.length <= ew.length) {
        const wordsOk = nw.every((w, i) => {
          if (ew[i].startsWith(w) && w.length >= 2) return true;
          if (w.length >= 4 && ew[i].includes(w)) return true;
          return false;
        });
        if (wordsOk && nw.join(' ').length >= Math.min(4, expected.length * 0.4)) {
          return { match: true, partial: nw.length < ew.length || n.length < expected.length };
        }
      }
    }
    return { match: false, partial: false };
  }

  function getLab() {
    return LAB_SCENARIOS[cliState.labId];
  }

  function flattenSteps(lab) {
    const flat = [];
    lab.modules.forEach((mod, mi) => {
      mod.steps.forEach((step, si) => {
        flat.push({ ...step, moduleIndex: mi, stepIndex: si, moduleTitle: mod.title, device: step.device || mod.device || lab.defaultDevice });
      });
    });
    return flat;
  }

  function getCurrentStep() {
    const lab = getLab();
    const flat = flattenSteps(lab);
    let idx = 0;
    for (let mi = 0; mi < lab.modules.length; mi++) {
      for (let si = 0; si < lab.modules[mi].steps.length; si++) {
        if (mi === cliState.moduleIndex && si === cliState.stepIndex) return flat[idx];
        idx++;
      }
    }
    return null;
  }

  function getPrompt() {
    const h = cliState.hostname;
    const m = cliState.mode;
    if (m === 'user') return `${h}>`;
    if (m === 'enable') return `${h}#`;
    if (m === 'config') return `${h}(config)#`;
    if (m === 'config-vlan') return `${h}(config-vlan)#`;
    if (m === 'config-if') return `${h}(config-if)#`;
    if (m === 'config-if-range') return `${h}(config-if-range)#`;
    if (m === 'config-line') return `${h}(config-line)#`;
    return `${h}>`;
  }

  function applyModeCommand(cmd) {
    const c = normCmd(cmd);
    if (c === 'enable') {
      cliState.mode = 'enable';
      return { ok: true, msg: '' };
    }
    if (c === 'configure terminal') {
      cliState.mode = 'config';
      return { ok: true, msg: '' };
    }
    if (c === 'exit' || c === 'end') {
      if (c === 'end') {
        cliState.mode = 'enable';
        return { ok: true, msg: '' };
      }
      const map = { 'config-line': 'config', 'config-if': 'config', 'config-if-range': 'config', 'config-vlan': 'config', config: 'enable', enable: 'user' };
      cliState.mode = map[cliState.mode] || 'user';
      return { ok: true, msg: '' };
    }
    if (c.startsWith('interface ')) {
      if (c.includes('range')) cliState.mode = 'config-if-range';
      else cliState.mode = 'config-if';
      return { ok: true, msg: '' };
    }
    if (c.startsWith('vlan ')) {
      cliState.mode = 'config-vlan';
      return { ok: true, msg: '' };
    }
    if (c.startsWith('line ')) {
      cliState.mode = 'config-line';
      return { ok: true, msg: '' };
    }
    if (c.startsWith('ip dhcp pool') || c === 'ip dhcp pool vlan10') {
      cliState.mode = 'config-dhcp'; // treat as sub-mode, still config for prompt
      return { ok: true, msg: '' };
    }
    return null;
  }

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const d = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) d[i][0] = i;
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return d[m][n];
  }

  function smartFeedback(input, step) {
    const n = normCmd(input);
    const exp = normCmd(step.cmd);
    if (n.includes('?')) return 'Commande incomplète — IOS afficherait les options. Essayez : ' + step.cmd;
    const variants = allExpectedVariants(step);
    for (const v of variants) {
      if (v.startsWith(n) && n.length >= 2) return `Début correct — complétez : <code>${step.cmd}</code>`;
    }
    const dist = levenshtein(n, exp);
    if (dist <= 3 && dist > 0) return `Presque ! Il manque un détail. Attendu : <code>${step.cmd}</code>`;
    if (n.startsWith('show') && !exp.startsWith('show')) return 'Vous êtes en mode configuration. Les commandes show s\'utilisent en mode enable (#), tapez <code>end</code> ou <code>exit</code> jusqu\'au prompt #.';
    if ((n.includes('vlan') || n.includes('switchport')) && cliState.mode === 'user') return 'Mode utilisateur insuffisant. Tapez <code>enable</code> puis <code>configure terminal</code>.';
    if (step.device && step.device !== cliState.hostname && !step.switchDevice) return `Cette étape se configure sur <strong>${step.device}</strong>. Utilisez le sélecteur d\'équipement ou attendez l\'étape R1.`;
    return step.hint || 'Commande incorrecte pour cette étape.';
  }

  function appendOutput(html, cls) {
    const out = document.getElementById('cliOutput');
    if (!out) return;
    const line = document.createElement('div');
    line.className = 'cli-line' + (cls ? ' ' + cls : '');
    line.innerHTML = html;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }

  function renderTopology() {
    const panel = document.getElementById('labTopologyPanel');
    const lab = getLab();
    if (!panel) return;
    if (!lab || !lab.hasTopology) {
      panel.style.display = 'none';
      return;
    }
    panel.style.display = 'block';
    panel.innerHTML = `
      <h4>📐 Architecture réseau — Lab Final</h4>
      <div class="topo-diagram-final">
        <div class="topo-row-final">
          <div class="topo-box cloud"><strong>Internet</strong>203.0.113.0/30</div>
        </div>
        <div class="topo-link-v"></div>
        <div class="topo-link-label">G0/1 — 203.0.113.2/30 (WAN)</div>
        <div class="topo-row-final">
          <div class="topo-box router"><strong>R1</strong>G0/0 trunk 802.1Q<br>G0/0.10 .20 .30</div>
        </div>
        <div class="topo-link-v"></div>
        <div class="topo-link-label">G0/1 trunk — VLANs 10,20,30,99 (native)</div>
        <div class="topo-row-final">
          <div class="topo-box switch"><strong>SW1</strong>Core<br>Root STP</div>
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div class="topo-link-h"></div>
            <div class="topo-link-label">Po1 LACP</div>
            <div class="topo-link-h"></div>
          </div>
          <div class="topo-box switch"><strong>SW2</strong>Distribution<br>Root secondary</div>
        </div>
        <div class="topo-link-v"></div>
        <div class="topo-row-final">
          <div class="topo-box pc"><strong>PC-HR</strong>VLAN 10<br>.10.11 DHCP</div>
          <div class="topo-box pc"><strong>PC-Sales</strong>VLAN 20<br>.20.11</div>
          <div class="topo-box pc"><strong>PC-Mkt</strong>VLAN 30<br>.30.11</div>
        </div>
        <div class="topo-vlans">
          <span class="topo-vlan-tag v10">VLAN 10 HR — 192.168.10.0/24 GW .1</span>
          <span class="topo-vlan-tag v20">VLAN 20 Sales — 192.168.20.0/24</span>
          <span class="topo-vlan-tag v30">VLAN 30 Market — 192.168.30.0/24</span>
          <span class="topo-vlan-tag v99">VLAN 99 Native — trunk</span>
        </div>
        <p style="text-align:center;margin-top:0.75rem;font-size:0.75rem;color:var(--text2);">
          Protocoles : 802.1Q · STP/RSTP · LACP · DHCP/DNS · SSH · Port-Security · DHCP Snooping · DAI
        </p>
      </div>
    `;
    panel.innerHTML = panel.innerHTML.replace(/<div/g, '<div').replace(/<\/motion>/g, '</div>');
  }

  function updateDeviceSelect() {
    const sel = document.getElementById('labDeviceSelect');
    const lab = getLab();
    if (!sel || !lab) return;
    const devices = lab.devices || ['SW1', 'R1'];
    const labels = { SW1: 'SW1 — Switch core', SW2: 'SW2 — Switch distribution', R1: 'R1 — Routeur / DHCP / WAN' };
    sel.innerHTML = devices.map(d => `<option value="${d}">${labels[d] || d}</option>`).join('');
    if (!devices.includes(cliState.hostname)) {
      cliState.hostname = lab.defaultDevice;
      cliState.device = lab.defaultDevice;
    }
    sel.value = cliState.hostname;
  }

  function renderChecklist() {
    const lab = getLab();
    const ul = document.getElementById('labChecklist');
    if (!ul || !lab) return;
    let html = '';
    lab.modules.forEach((mod, mi) => {
      const done = mi < cliState.moduleIndex;
      const current = mi === cliState.moduleIndex;
      html += `<li class="${done ? 'done' : ''} ${current ? 'current' : ''}" data-mi="${mi}">${mod.title}</li>`;
    });
    ul.innerHTML = html;
  }

  function renderObjective() {
    const step = getCurrentStep();
    const el = document.getElementById('labObjective');
    const tuto = document.getElementById('labTuto');
    const lab = getLab();
    if (!step) {
      if (el) el.innerHTML = `<strong>🎉 Lab terminé !</strong> Toute la configuration « ${lab.title} » est appliquée. Choisissez un autre lab ou réinitialisez.`;
      if (tuto) tuto.textContent = '';
      return;
    }
    if (el) {
      el.innerHTML = `<strong>Module ${cliState.moduleIndex + 1}/${lab.modules.length} — ${step.moduleTitle}</strong><br>
        Étape ${cliState.stepIndex + 1}/${lab.modules[cliState.moduleIndex].steps.length} sur <strong>${step.device || cliState.hostname}</strong> : ${step.hint || 'Appliquez la commande indiquée dans le tuto.'}`;
    }
    if (tuto) tuto.innerHTML = step.tuto ? `📖 ${step.tuto}` : '💡 Début de commande accepté (ex: <code>sw</code> → switchport…). <code>hint</code> | <code>solution</code>';
    const prog = document.getElementById('labProgress');
    if (prog) {
      const flat = flattenSteps(lab);
      let cur = 0;
      for (let mi = 0; mi < cliState.moduleIndex; mi++) cur += lab.modules[mi].steps.length;
      cur += cliState.stepIndex;
      prog.textContent = `Progression : ${cur}/${flat.length}`;
    }
    document.getElementById('cliPromptLabel').textContent = getPrompt();
    const devSel = document.getElementById('labDeviceSelect');
    if (devSel) devSel.value = cliState.hostname;
  }

  function advanceStep(step) {
    if (step.switchDevice) {
      const mod = getLab().modules[cliState.moduleIndex];
      const nextDev = step.device || mod?.device || (cliState.hostname === 'SW1' ? 'R1' : 'SW1');
      cliState.hostname = nextDev;
      cliState.device = nextDev;
      cliState.mode = 'user';
      updateDeviceSelect();
    }
    const lab = getLab();
    cliState.stepIndex++;
    if (cliState.stepIndex >= lab.modules[cliState.moduleIndex].steps.length) {
      cliState.stepIndex = 0;
      cliState.moduleIndex++;
    }
    renderChecklist();
    renderObjective();
  }

  function processCommand(raw) {
    const input = raw.trim();
    if (!input) return;

    appendOutput(`<span style="color:#f9a8d4">${getPrompt()}</span>${input}`);

    const low = input.toLowerCase();
    if (low === 'help' || low === '?' || low === 'hint') {
      const step = getCurrentStep();
      appendOutput(step ? `💡 ${step.hint}` : 'Lab terminé.', 'hint');
      return;
    }
    if (low === 'solution') {
      const step = getCurrentStep();
      if (step) appendOutput(`Solution : <code style="color:#fde68a">${step.cmd}</code>`, 'hint');
      return;
    }
    if (low === 'clear') {
      document.getElementById('cliOutput').innerHTML = '';
      return;
    }

    const step = getCurrentStep();
    if (!step) {
      appendOutput('Lab déjà terminé. Sélectionnez « Réinitialiser ».', 'sys');
      return;
    }

    if (step.device && step.device !== cliState.hostname && !step.switchDevice) {
      appendOutput(`⚠ Équipement attendu : ${step.device}. Changez l\'appareil simulé.`, 'err');
      return;
    }

    const matchResult = cmdMatches(input, step);
    const modeResult = applyModeCommand(input);
    const isNavCmd = ['enable', 'configure terminal', 'exit', 'end'].includes(normCmd(input))
      || normCmd(input).startsWith('interface ') || normCmd(input).startsWith('vlan ')
      || normCmd(input).startsWith('line ');

    if (modeResult && !matchResult.match && isNavCmd) {
      appendOutput(modeResult.msg || 'OK.', 'ok');
      appendOutput(`↳ Navigation IOS OK — commande attendue pour cette étape : <code>${step.cmd}</code>`, 'hint');
      renderObjective();
      return;
    }

    if (matchResult.match) {
      applyModeCommand(input);
      const partialNote = matchResult.partial ? ' (reconnu par début de commande — bien !)' : '';
      appendOutput(`✓ ${step.success || 'Correct.'}${partialNote}`, 'ok');
      if (step.tuto) appendOutput(`📖 ${step.tuto}`, 'sys');
      advanceStep(step);
    } else {
      appendOutput(`✗ ${smartFeedback(input, step)}`, 'err');
      appendOutput(`Attendu : <code>${step.cmd}</code>`, 'hint');
    }
    renderObjective();
  }

  function resetLab() {
    const lab = getLab();
    cliState.hostname = lab.defaultDevice;
    cliState.device = lab.defaultDevice;
    cliState.mode = 'user';
    cliState.moduleIndex = 0;
    cliState.stepIndex = 0;
    updateDeviceSelect();
    renderTopology();
    const out = document.getElementById('cliOutput');
    if (out) {
      out.innerHTML = '';
      appendOutput(`<span class="sys">=== ${lab.title} ===</span>`, 'sys');
      appendOutput(`<span class="sys">${lab.topology}</span>`, 'sys');
      appendOutput(`<span class="sys">Commandes complètes ou début suffisant (ex: conf t, int g0/1, sw mode acc). Aide : hint | solution | clear</span>`, 'sys');
    }
    renderChecklist();
    renderObjective();
  }

  function selectLab(labId) {
    if (!LAB_SCENARIOS[labId]) return;
    cliState.labId = labId;
    document.querySelectorAll('.lab-tab').forEach(t => t.classList.toggle('active', t.dataset.lab === labId));
    const title = document.getElementById('labSimTitle');
    if (title) title.textContent = LAB_SCENARIOS[labId].title;
    resetLab();
  }

  function initLabSimulator() {
    const input = document.getElementById('cliInput');
    if (!input) return;

    if (!window._labSimInited) {
      window._labSimInited = true;
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          processCommand(input.value);
          input.value = '';
        }
      });
      const tabs = document.getElementById('labTabs');
      if (tabs) {
        tabs.addEventListener('click', e => {
          const tab = e.target.closest('.lab-tab');
          if (tab && tab.dataset.lab) selectLab(tab.dataset.lab);
        });
      }
      const devSel = document.getElementById('labDeviceSelect');
      if (devSel) {
        devSel.addEventListener('change', () => {
          cliState.hostname = devSel.value;
          cliState.device = devSel.value;
          cliState.mode = 'user';
          appendOutput(`— Connexion à ${cliState.hostname} —`, 'sys');
          renderObjective();
        });
      }
    }

    if (!window._labSimBooted) {
      window._labSimBooted = true;
      selectLab('lab1');
    } else {
      renderChecklist();
      renderObjective();
    }

    if (document.getElementById('section-lab')?.classList.contains('active')) {
      setTimeout(() => input.focus(), 80);
    }
  }

  window.initLabSimulator = initLabSimulator;
  window.labSimReset = resetLab;
  window.labSimHint = () => processCommand('hint');
  window.labSimSolution = () => processCommand('solution');
})();
