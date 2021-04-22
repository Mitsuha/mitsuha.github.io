---
title: 将 Go 程序注册为一个 Window 服务（原生）
date: 2021-04-22 16:13:56
tags: [Go, Code, Windows]
cover: https://pic.iask.cn/fimg/838593252458.jpg
opacity: 0.5
---
> Pixiv id of the cover: 75471021

> 这是一篇没有写完的文章

&emsp; 写了一个小玩具需要一直放在后台运行，就用 Windows Service 吧！ Service 可以在后台长时间运行程序，并且可以在开机时启动、随时暂停和恢复，非常适合跑一些不需要管理的任务。官方提供了 [sys/windows/svc][1] 包对 Service 提供了必要的支持，虽然用起来比较繁琐，但是学习可以较深的理解 Windows 处理 Service 的一些细节。那本文就来用 [sys/windows/svc][1] 和其子包实现了一个提供 http 服务的小 demo，可以通过 shell 去注册和控制 Service，我们可以随时运行 services.msc 打开服务窗口，方便调试

## 注册一个 Service
先启动一个 http 服务，解析一下命令行，使用 `--install` 的时候去注册 Service。**为表简洁，下面的代码就不贴 httpService 函数和一些解析的代码了**
```(golang)
package main

import (
	"flag"
	"net/http"
)
var flagServiceInstall = flag.Bool("install", false, "Install service")

func main() {
	flag.Parse()
	if *flagServiceInstall {
		... install service
	}
	httpService()
}

func httpService() {
	http.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
		writer.Write([]byte("<h1>Hello world</h1>"))
	})

	_ = http.ListenAndServe("0.0.0.0:8080", nil)
}
```
接下来我们写一个方法去注册服务。首先使用 mgr 包去建立到服务控制管理器的连接，成功后就可以使用 CreateService 函数建立新的 Service 了。CreateService 需要的 mgr.Config 并不是每一个配置项都是必须的，有一些可选值可以参考我找到的微软的官方文档：
[ServiceType 枚举 (System.ServiceProcess) | Microsoft Docs][2]
[ServiceStartMode 枚举 (System.ServiceProcess) | Microsoft Docs][3]
```
func install() {
	m, err := mgr.Connect()
	if err != nil {
		log.Fatalln(err)
	}
	defer m.Disconnect()
	
	s, err := m.CreateService("Service name", "program path",
		mgr.Config{
			ServiceType:      windows.SERVICE_WIN32_OWN_PROCESS,
			StartType:        windows.SERVICE_AUTO_START,
			ServiceStartName: "Service name",
			DisplayName:      "Service alias name",
			Description:      "Service Description",
			DelayedAutoStart: false,
		},
		"-t -r ....",
	)
	if err != nil {
		log.Fatalln(err)
	}
	s.Close()
}
```


[1]: https://pkg.go.dev/golang.org/x/sys/windows/svc/
[2]: https://docs.microsoft.com/zh-cn/dotnet/api/system.serviceprocess.servicetype
[3]: https://docs.microsoft.com/zh-cn/dotnet/api/system.serviceprocess.servicestartmode
