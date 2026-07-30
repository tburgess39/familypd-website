window.FPD_COMPONENTS = {
  motherboard:{title:'Motherboard',body:'The main circuit board that connects the processor, memory, storage, expansion cards, firmware, power, and external ports.',security:'Firmware settings, Secure Boot, TPM support, physical access, and hardware compatibility can affect security.'},
  cpu:{title:'CPU / Processor',body:'Executes instructions and coordinates much of the computer’s work.',security:'Privilege levels, virtualization support, firmware updates, and processor vulnerabilities matter to defenders.'},
  ram:{title:'RAM',body:'Fast temporary memory used by running programs. Most contents disappear when power is removed.',security:'Passwords, keys, and other sensitive data may temporarily exist in memory while software is running.'},
  storage:{title:'Storage',body:'SSDs, hard drives, and flash media retain files when power is removed.',security:'Encryption, permissions, backups, secure disposal, and file-system integrity protect stored data.'},
  nic:{title:'Network Interface',body:'Connects a device to wired or wireless networks.',security:'Drivers, segmentation, firewall rules, MAC addresses, and traffic monitoring affect network exposure.'},
  gpu:{title:'GPU',body:'Processes graphics and highly parallel workloads.',security:'GPU drivers need updates, and GPUs can accelerate authorized password-auditing or data-analysis workloads.'},
  psu:{title:'Power Supply',body:'Converts wall power into voltages used by computer components.',security:'Reliable power, correct capacity, surge protection, and backups support availability.'},
  firmware:{title:'Firmware / UEFI',body:'Low-level software that starts hardware and prepares the operating system to run.',security:'Secure Boot, firmware passwords, TPM settings, and signed updates help resist low-level tampering.'},
  os:{title:'Operating System',body:'Manages users, files, applications, memory, processes, devices, and networking.',security:'Updates, accounts, permissions, services, logs, encryption, and firewall settings are central to system hardening.'},
  peripheral:{title:'Peripherals',body:'Printers, cameras, keyboards, USB devices, and other connected equipment.',security:'Removable media, device permissions, drivers, physical controls, and supply-chain trust all matter.'}
};

window.FPD_PORTS = {
  '20/21':{name:'FTP',use:'Transfers files. Traditional FTP does not protect credentials or data with encryption.',security:'Prefer secure alternatives such as SFTP or FTPS when supported.'},
  '22':{name:'SSH',use:'Provides encrypted remote command-line access and can support secure file transfer.',security:'Use strong authentication, limit exposure, patch the service, and review logs.'},
  '23':{name:'Telnet',use:'Provides remote text access without modern encryption.',security:'Avoid it on untrusted networks; SSH is normally the safer replacement.'},
  '25':{name:'SMTP',use:'Moves email between mail systems.',security:'Mail servers need authentication, filtering, encryption support, and anti-spoofing controls.'},
  '53':{name:'DNS',use:'Translates names such as familypd.org into IP addresses.',security:'Protect resolvers, restrict zone transfers, log anomalies, and consider DNS filtering.'},
  '67/68':{name:'DHCP',use:'Automatically gives devices IP configuration.',security:'Rogue DHCP can redirect traffic; use trusted network controls and monitoring.'},
  '80':{name:'HTTP',use:'Carries unencrypted web traffic.',security:'Use HTTPS for sensitive content and redirect plain HTTP where appropriate.'},
  '110':{name:'POP3',use:'Retrieves email from a server in its traditional form.',security:'Prefer encrypted variants and modern secure mail configurations.'},
  '143':{name:'IMAP',use:'Synchronizes email while messages remain on the server.',security:'Use encrypted IMAPS or STARTTLS and strong account protection.'},
  '443':{name:'HTTPS',use:'Carries web traffic protected with TLS.',security:'Encryption helps, but a phishing site can also use HTTPS—verify the domain and purpose.'},
  '445':{name:'SMB',use:'Supports Windows file and printer sharing.',security:'Do not expose it broadly to the internet; patch, segment, authenticate, and limit shares.'},
  '3389':{name:'RDP',use:'Provides graphical remote access to Windows systems.',security:'Restrict access, require MFA where possible, use a VPN or gateway, patch, and monitor attempts.'}
};
